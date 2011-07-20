#!/usr/bin/env bash

MOD_HOME=`readlink -f $0`
MOD_HOME=`dirname ${MOD_HOME}`

unset PATH
unset JAVA_HOME
if [ -d $HOME/hudson/CI/bin/jdk1.6.0_06/ ]; then
  # danweb01
  export JAVA_HOME=$HOME/hudson/CI/bin/jdk1.6.0_06/
else
  export JAVA_HOME=${JAVA_HOME_1_6}
fi
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export ANT_HOME=${MOD_HOME}/externs/sdcfe/tools/ant
export PATH=${JAVA_HOME}/bin:${ANT_HOME}/bin:/usr/local/bin:/usr/bin:/bin

ant deploy
