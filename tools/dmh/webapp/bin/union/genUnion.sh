#!/bin/sh

#该任务每日生成前一天的消费统计数据给Union。每日00:30开始生成前一天数据。存放位置tc-dan-web00.tc/home/work/dnweb/data/export/uniondata
source ./union.conf

export PATH=$ANT_HOME/bin:$JAVA_HOME/bin:$PATH
ant -f ../build.xml genUnion -Dfile="${LOCAL_GEN_FILE_PATH}/${GEN_FILE}"


if [ "$?" -ne "0" ]; then   
        hit "Gen billing file for Union failed! Please check task log! File location: ${LOCAL_GEN_FILE_PATH}/${GEN_FILE}!" 
        exit 1;
fi

cd ${LOCAL_GEN_FILE_PATH}
md5sum ${GEN_FILE} > ${GEN_FILE}.md5

if [ "$?" -ne "0" ]; then   
    hit "${GEN_FILE} MD5 checksum generate failed!"
    exit 1
fi



