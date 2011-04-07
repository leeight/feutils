#!/usr/bin/env bash

cp ~/dev/closure-compiler/build/compiler.jar ../../tools/lib/google-closure-compiler.jar 

MOD_HOME=`dirname ${0}`
TOOL_DIR=${MOD_HOME}/../../tools
python \
  ${TOOL_DIR}/lib/calcdeps.py \
  -p . \
  -p ~/dev/closure-library/closure/goog/ \
  -c ${TOOL_DIR}/lib/google-closure-compiler.jar \
  -f "--summary_detail_level=3" \
  -f "--compilation_level=ADVANCED_OPTIMIZATIONS" \
  -f "--generate_exports" \
  -f "--formatting=PRETTY_PRINT" \
  -f "--warning_level=VERBOSE" \
  -f "--css_output_file=${MOD_HOME}/build/dn.css" \
  -f "--tpl_output_file=${MOD_HOME}/build/tpl.html" \
  -o compiled \
  --output_file "${MOD_HOME}/build/sample.js" \
  -i "${1}"
