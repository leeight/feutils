#!/bin/bash


#该任务从Union同步计费名域名对。每5分钟一次。CT任务需要从2分开始
source ./union.conf

#ftp
wget -T 20 -t 5 ftp://${SOURCE_SERVER}/${SOURCE_PATH}/${SOURCE_FILE} -O ${DATA_PATH}/${LOCAL_FILE}

if [ "$?" -ne "0" ]; then   
    hit "from ${SOURCE_SERVER} download ${SOURCE_FILE},exec wget command error"
    exit 1
fi

wget -T 20 -t 5 ftp://${SOURCE_SERVER}/${SOURCE_PATH}/${SOURCE_MD5_FILE} -O ${DATA_PATH}/${LOCAL_MD5_FILE}

if [ "$?" -ne "0" ]; then   
    hit "from ${SOURCE_SERVER} download ${SOURCE_MD5_FILE},exec wget command error"
    exit 1
fi

#验证MD5
CURRENT=`pwd`
cd ${DATA_PATH}
md5sum -c ${LOCAL_MD5_FILE}

if [ "$?" -ne "0" ]; then   
    hit "${LOCAL_MD5_FILE} MD5 checksum validate failed!"
    exit 1
fi

cd $CURRENT

export PATH=$ANT_HOME/bin:$JAVA_HOME/bin:$PATH
ant -f ../build.xml syncUnion -Dfile="${DATA_PATH}/${LOCAL_FILE}"

if [ "$?" -ne "0" ]; then   
        hit "sync billing name from Union failed! Please check task log!" 
        exit 1;
fi
