#!/bin/sh 

#
# common configuration
#
. common.conf

#
# file root , log file
#
FILE_ROOT=$EXPORT_FILE_PLANNING_FORECASTING_ROOT/planning
LOG_FILE=${EXPORT_FILE_PLANNING_FORECASTING_ROOT}/planningLog.export

#
# info
#
echo `date`" ****** start ******" >> $LOG_FILE

#
# make dir
#
if [ ! -d $FILE_ROOT ]        
then
	mkdir $FILE_ROOT
fi

#
# check the program instance is only one
#
FLAG_FILE=${FILE_ROOT}/running
if [ -f "$FLAG_FILE" ]; then
    echo "The task is already running!"  >> $LOG_FILE;
    exit 1;
else
    touch $FLAG_FILE;
fi

#
# cd the classpath dir
#
cd $BUILD_ROOT

#
# execute the command
#
ant -f toolsBuild.xml planningTask -DfilePath=${FILE_ROOT} >> $LOG_FILE 2>&1

#
# check the return value
#
if [ "$?" -ne "0" ]; then   
    hit "Planning task failed! Please check task log!"
fi

#
# end of program
#
rm -f $FLAG_FILE

echo `date`" ****** end ******" >> $LOG_FILE

exit 0
