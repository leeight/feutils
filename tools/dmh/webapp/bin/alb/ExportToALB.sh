#!/bin/sh

. common.conf

FILE_ROOT=$EXPORT_FILE_ROOT
LOG_FILE=${FILE_ROOT}/log.export
FileName="DanCost-"`date -d "-6 hours" +%Y%m%d`

echo `date`" ****** start ******" >> $LOG_FILE

FLAG_FILE=${FILE_ROOT}/running
if [ -f "$FLAG_FILE" ]; then
    echo "上次任务未结束，退出"  >> $LOG_FILE;
    exit 1;
else
    touch $FLAG_FILE;
fi

cd $BUILD_ROOT

ant exportToALB -Dpath=${FILE_ROOT}"/"${FileName}".txt" >> $LOG_FILE 2>&1

if [ "$?" -ne "0" ]; then   
    hit "Export order to ALB failed! Please check task log!"
else
    cd $FILE_ROOT

    if [ -f "${FileName}.txt" ]; then
        md5sum ${FileName}".txt" > ${FileName}".md5"
    else
        hit "Export order to ALB failed! Please check task log!"
        echo `date`" export file failed!" >> ${LOG_FILE}
    fi
fi

rm -f $FLAG_FILE

echo `date`" ****** end ******" >> $LOG_FILE

exit 0
