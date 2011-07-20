#!/bin/bash

#该任务每3分钟从计费端获得新的计费日志。依赖ant 1.8及以上版本

if [ $# != 1 ] ; then
    echo "USAGE: $0 CONFIGFILE"
    echo " e.g.: $0 adpconsumption_1.conf"
    exit 1;
fi

source ./$1

echo "starting "`date`

#初始化列表
echo > ${TRACK_FILELIST}

#确保tmp文件都删除，以免重复统计
find -name "*.tmp" |xargs rm -fr

#获取自上次处理后的新文件,
echo "retrieving file list from ${TRACK_LATESTFILE}"
echo "ant -f syncAdConsumption.xml  -lib ./lib listAllDat -DremotePath=${REMOTE_FTP_PATH} -DlatestFile=`cat ${TRACK_LATESTFILE}`  -DremoteServerHost=${REMOTE_FTP_HOST} -DremoteServerAccount=${ACCOUNT} -DremoteServerPWD=${PASSWORD} -DfileList=${TRACK_FILELIST}"
ant -f syncAdConsumption.xml  -lib ./lib listAllDat -DremotePath=${REMOTE_FTP_PATH} -DlatestFile=`cat ${TRACK_LATESTFILE}`  -DremoteServerHost=${REMOTE_FTP_HOST} -DremoteServerAccount=${ACCOUNT} -DremoteServerPWD=${PASSWORD} -DfileList=${TRACK_FILELIST}

if [ "$?" -ne "0" ]; then   
        hit "Get billing file list failed! Please check task log and latest file is `cat ${TRACK_LATESTFILE}`!" 
        exit 1;
fi

#如果存在文件路径，则去除;文件名升序排列
echo "sorting file list"
sed -n "s/.*\(${LOGFILE_PREFIX}.*${LOGFILE_SUFFIX}\)/\1/p" ${TRACK_FILELIST}|sort > ${LOCAL_FILE_PATH}/list.tmp

#合并失败文件列表和本次文件列表
echo "merging file list"
if [ -f ${TRACK_FAILEDFILES} ] 
then
    cat ${TRACK_FAILEDFILES} > ${LOCAL_FILE_PATH}/allfile.tmp
    #失败文件列表会被更新
    rm ${TRACK_FAILEDFILES}
fi
if [ -f ${LOCAL_FILE_PATH}/list.tmp ] 
then
    cat ${LOCAL_FILE_PATH}/list.tmp >> ${LOCAL_FILE_PATH}/allfile.tmp
fi

#处理文件列表中的每个文件
echo "retrieving and verifying file content"
while read FILE
do
    
    #根据文件名获得文件所在文件夹
    DATESTR=`echo $FILE|sed -n "s/.*_\([0-9]\{8\}\).*/\1/p"`
    
    #如果文件夹不存在则创建
    if [ ! -d "${LOCAL_FILE_PATH}/${DATESTR}" ]
    then
        mkdir "${LOCAL_FILE_PATH}/${DATESTR}"
    fi

    wget -c -T 20 -t 5 --user=${ACCOUNT} --password=${PASSWORD} ftp://${REMOTE_FTP_HOST}/${REMOTE_FTP_PATH}/${DATESTR}/${FILE} -O ${LOCAL_FILE_PATH}/${DATESTR}/${FILE}
    
    if [ "$?" -ne "0" ]; then   
        echo "from ${REMOTE_FTP_HOST} download ${FILE},exec wget command error"
        #将失败文件放入失败列表中，供下次获取
        echo ${FILE} >> ${LOCAL_FILE_PATH}/fail.tmp
        continue
    fi
    
    MD5_FILE=${FILE}.md5
    
    wget -c -T 20 -t 5 --user=${ACCOUNT} --password=${PASSWORD} ftp://${REMOTE_FTP_HOST}/${REMOTE_FTP_PATH}/${DATESTR}/${MD5_FILE} -O ${LOCAL_FILE_PATH}/${DATESTR}/${MD5_FILE}
    
    if [ "$?" -ne "0" ]; then   
        echo "from ${REMOTE_FTP_HOST} download ${MD5_FILE},exec wget command error"
        continue
    fi
    
    #验证MD5
    CURRENT=`pwd`
    cd ${LOCAL_FILE_PATH}/${DATESTR}
    md5sum -c ${MD5_FILE}
    
    if [ "$?" -ne "0" ]; then   
        echo "${MD5_FILE} MD5 checksum validate failed!"
        #将失败文件放入失败列表中，供下次获取
        echo ${FILE} >> ${LOCAL_FILE_PATH}/fail.tmp
        continue
    fi
    
    cd ${CURRENT}
    
    #更新最新文件名
    echo ${FILE} > ${TRACK_LATESTFILE}
    
    #将文件记为待导入
    echo ${LOCAL_FILE_PATH}/${DATESTR}/${FILE} >> ${LOCAL_FILE_PATH}/tobeimported.tmp
    
done < ${LOCAL_FILE_PATH}/allfile.tmp

#更新失败文件列表
echo "refreshing fail list"
if [ -f ${LOCAL_FILE_PATH}/fail.tmp ]
then
    mv ${LOCAL_FILE_PATH}/fail.tmp ${TRACK_FAILEDFILES}
fi

#处理新文件，将记录导入数据库
if [ -f ${LOCAL_FILE_PATH}/tobeimported.tmp ]
then
    echo "import data into database"
    
    ant -f syncAdConsumption.xml calculate -Dfilelist=${LOCAL_FILE_PATH}/tobeimported.tmp -Dfaillist=${LOCAL_FILE_PATH}/${TRACK_FAILEDFILES}
    
    if [ "$?" -ne "0" ]; then   
        #保留出错的文件列表
        BAK_FILE=${LOCAL_FILE_PATH}/tobeimported.`date +"%Y%m%d%H%M"`
        cp ${LOCAL_FILE_PATH}/tobeimported.tmp ${BAK_FILE}
        
        hit "Add ad consumption to database failed! Please check task log and backup file list in ${BAK_FILE}!" 
    fi
fi

#如果失败文件不为空，则报警
if [ -s ${TRACK_FAILEDFILES} ]
then
    BAK_FAIL_FILE=${TRACK_FAILEDFILES}.`date +"%Y%m%d%H%M"`
    cp ${TRACK_FAILEDFILES} ${BAK_FAIL_FILE}
    hit "Import files into database failed! Please check task log and file list in ${BAK_FAIL_FILE}!" 
fi

#删除临时文件
#echo "deleting temperary files"
rm ${LOCAL_FILE_PATH}/*.tmp

echo "done. "`date`