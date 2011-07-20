#!/bin/sh

. common.conf

ROOT_PATH=$IMPORT_FILE_ROOT
LOG_FILE=${ROOT_PATH}/log.import

if [ ! -d $ROOT_PATH ]; then
    mkdir $ROOT_PATH
fi

echo `date`" ****** start ******" >> $LOG_FILE

#先设置一个flag，如果存在则退出，防止任务重叠
FLAG_FILE=${ROOT_PATH}/running
if [ -f "$FLAG_FILE" ]; then
    echo "上次任务未结束，退出"  >> $LOG_FILE;
    exit 1;
else
    touch $FLAG_FILE;
fi

FILE_PATH=${ROOT_PATH}"/"`date +%y%m%d`
if [ ! -d $FILE_PATH ]; then
    mkdir $FILE_PATH
fi

#构造本次任务需要下载的文件名
SECS=`date +%s`
SECS=$((SECS - (SECS-5*60) % (15*60)))
FileName="albcontractline"`date -d "1970-01-01 UTC ${SECS} seconds" +%y%m%d.%H%M`
MD5FileName=${FILENAME}".md5"

#上次未处理的文件
UndoFile=${ROOT_PATH}/undofile

#本次待处理的文件
NeedFileList=""

#更新失败的待处理文件
FailedFileList=""

#任务状态
#0:还未有文件更新成功 1:已有文件更新成功 2:已有文件更新成功且又有文件更新失败
TaskState=0

if [ -f "${UndoFile}" ]; then
    UndoFileList=`cat ${UndoFile}`
else
    UndoFileList=""
fi

#检查undofile中是否有内容，且是否与当前文件名重复
match=`echo $UndoFileList|wc -l`
if [ "$match" -eq "0" ]; then
    NeedFileList=$FileName
else
    FileInUndo=0
    for i in $UndoFileList
    do
        if [ $i == $FileName ]; then
            FileInUndo=1
        fi
    done
    if [ $FileInUndo -eq 0 ]; then
        NeedFileList=${UndoFileList}" "$FileName
    else
        NeedFileList=$UndoFileList
    fi
fi

cd $FILE_PATH

for i in $NeedFileList
do
Fail=0
#状态0和1时尝试获取文件
if [ $TaskState -ne 2 ]; then
    #获取MD5文件
    wget -T 20 -t 5 ftp://${FTP_PATH}/${i}.md5 >> $LOG_FILE 2>&1

    #如果md5文件存在
    if [ "$?" -eq "0" -a -f "${i}.md5" ]; then
        #check md5
        wget -T 20 -t 5 ftp://${FTP_PATH}/${i} >> $LOG_FILE 2>&1
        if [ "$?" -eq "0" -a -f "${i}" ]; then
            SOURCE_MD5SUM=`cat ${i}.md5`
            LOCAL_MD5SUM=`md5sum ${i}`
            if [ "${LOCAL_MD5SUM}" == "${SOURCE_MD5SUM}" ]; then
                #调用Java程序处理文件
                cd $BUILD_ROOT
                ant importFromALB -Dfilename=${FILE_PATH}"/"${i} >> $LOG_FILE 2>&1
                if [ "$?" -ne "0" ]; then   
                    Fail=1
                else
                    TaskState=1
                fi
                cd $FILE_PATH
            else
                echo `date`" file ${i} md5 not match!" >> ${LOG_FILE}
                Fail=1
            fi
        else
            echo `date`" get file ${i} failed!" >> ${LOG_FILE}
            Fail=1
        fi
    else
        echo `date`" get file ${i}.md5 failed!" >> ${LOG_FILE}
        Fail=1
    fi

    #判断更新是否成功，如果成功则清空失败文件列表
    if [ $Fail -eq 1 ]; then
        if [ $TaskState -eq 1 ]; then
            TaskState=2
            FailedFileList=$i
        else
            FailedFileList=${FailedFileList}" "$i
        fi
    else
        FailedFileList=""
    fi
else
    FailedFileList=${FailedFileList}" "$i
fi

done

#写回更新失败文件
echo $FailedFileList > ${ROOT_PATH}/undofile
if [ "${FailedFileList}" != "" ]; then
    hit "Import order from ALB failed! Please check task log!"
fi

#删除运行flag
rm -f $FLAG_FILE

echo `date`" ****** end ******" >> $LOG_FILE

exit 0
