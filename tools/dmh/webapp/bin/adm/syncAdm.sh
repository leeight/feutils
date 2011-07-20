#!/bin/sh

#该任务从广告管家同步删除的广告位。时间间隔：5分钟
. syncAdm.conf

export PATH=$ANT_HOME/bin:$JAVA_HOME/bin:$PATH

ant -f ../build.xml syncAdm -Dfile=${ADM_LAST_OPID_FILE}

if [ "$?" -ne "0" ]; then   
        hit "Synchronize Slot Status from ADM failed! Please check task log!" 
fi