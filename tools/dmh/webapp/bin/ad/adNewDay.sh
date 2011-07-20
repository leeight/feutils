#!/bin/sh
source ../env.conf

ant -f ../build.xml adNewDayNotify

if [ "$?" -ne "0" ]; then   
        hit "AD new day processing failed! Please check task log!"
        exit 1        
fi