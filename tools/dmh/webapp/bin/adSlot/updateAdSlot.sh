#!/bin/sh
source ../env.conf

ant -f ../build.xml updateSlotStatus >> updateSlotStatus.log 2>&1

if [ "$?" -ne "0" ]; then   
        hit "Update ad slot failed! Please check task log!"
        exit 1        
fi