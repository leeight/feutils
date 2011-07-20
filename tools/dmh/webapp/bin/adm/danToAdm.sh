#!/bin/sh

#该任务将DAN中，状态更新了的广告位，同步至广告管家。时间间隔：1分钟
. syncAdm.conf

export PATH=$ANT_HOME/bin:$JAVA_HOME/bin:$PATH

ant -f ../build.xml danToAdm

if [ "$?" -ne "0" ]; then   
        hit "Deliver slot status to ADM failed! Please check task log!"
        exit 1        
fi