#!/usr/bin/env bash

FULL_FILE_NAME="$1"
FILE_NAME="`echo ${FULL_FILE_NAME} | cut -d . -f 1`"

for bps in 64 128 256 384 512
do
  ffmpeg \
    -i ${FULL_FILE_NAME} \
    -ar 22050 \
    -ac 1 \
    -ab 8k \
    -s 320x380 \
    -b ${bps}k \
    -vcodec libx264 \
    -vpre hq \
    -acodec libfaac \
    -aspect 4:3 \
    -cropbottom 70 \
    -croptop 70 \
    -y ${FILE_NAME}.${bps}k.flv
done
