#!/bin/bash
set -e

MOD_HOME=`readlink -f $0`
MOD_HOME=`dirname ${MOD_HOME}`
TMP_FILE=`mktemp`
BUILD_HOME=`dirname ${MOD_HOME}`/output
BUILD_TIME="`date +%F\ %H:%M:%S`@`hostname`"
BUILD_VERSION="`svn info | grep '^Revision:' | awk '{print $2}'`"
LIB_HOME="${MOD_HOME}/externs/sdcfe/tools/lib"

# 貌似scmpf的机器上有1.6的java，不需要模块里面的jre.tar.gz这个大家伙了
unset PATH
export PATH=$HOME/hudson/CI/bin/jdk1.6.0_06/bin:$JAVA_HOME_1_6/bin:$JAVA_HOME/bin:/bin:/usr/bin:/usr/local/bin
cd ${MOD_HOME}

echo "== ENV =="
echo $PATH
java -version
echo "== END =="

# 准备工作
#
prepare(){
    # 删掉一些无用的文件
    rm -rf $BUILD_HOME
}

# 获取合并之后的JS文件
#
# 参数：
#   需要处理的js文件
merge_js(){
    IN=$1
    OUT="${BUILD_HOME}/${IN}"
    mkdir -p `dirname ${OUT}`

    echo "mergeing ${IN} ..."
    awk -F"\"" '{print $4}' $IN | grep -v "^$" | while read js
    do
      if [ -f ${MOD_HOME}/${js} ]; then
        cat ${MOD_HOME}/${js} >> ${OUT}
      fi
    done
}

# 编译JS
# 现在的代码还不支持高级优化，但是高级优化选项很有吸引了，代码可以减少100K+
#
# 参数：
#   1. 需要处理的JS文件
#   2. 输出
compile_js(){
    IN="$1"
    OUT=`mktemp`

    echo "compiling ${IN} ..."
    if [ "${USER}" = "scmpf" ]; then
      java -jar ${LIB_HOME}/google-closure-compiler.jar \
           --define='dn.COMPILED="true"' \
           --warning_level=VERBOSE \
           --externs=src/tangram.externs.js \
           --js ${IN} --js_output_file ${OUT}
    else
      java -jar ${LIB_HOME}/google-closure-compiler.jar \
           --formatting PRETTY_PRINT \
           --warning_level=VERBOSE \
           --define='dn.COMPILED="true"' \
           --externs=src/tangram.externs.js \
           --js ${IN} --js_output_file ${OUT}
    fi
    [ $? -eq 0 ] || { 
      echo "FAILED"
      exit 1
    }
    mv ${OUT} ${IN}
}

# 获取合并之后的CSS文件
#
# 参数：
#   需要处理的css文件
merge_css(){
    IN="$1"
    OUT="${BUILD_HOME}/${IN}"
    mkdir -p `dirname ${OUT}`

    echo "mergeing ${IN} ..."
    awk -F"'" '{print $2}' ${IN} | grep -v "^$" | while read css
    do
      if [ -f "src/css/${css}" ]; then
        cat src/css/${css} >> ${OUT}
      fi
    done
}

# 编译CSS
#
# 参数：
#   1. 需要处理的CSS文件
#   2. 输出
compile_css(){
    IN="$1"
    OUT=`mktemp`
    
    echo "compiling ${IN} ..."
    java -jar ${LIB_HOME}/yui-compressor.jar \
        --type css \
        -o ${OUT} ${IN}
    mv ${OUT} ${IN}
}

# 获取合并之后的模板文件
#
# 参数：
#   需要处理的tpl文件
merge_tpl(){
    IN="$1"
    OUT="${BUILD_HOME}/assets/tpl.html"
    mkdir -p `dirname ${OUT}`

    echo "mergeing ${IN} ..."
    egrep -o "(/src/[^\.]+\.html)" ${IN} | while read html
    do
      if [ -f ${MOD_HOME}/${html} ]; then
        cat ${MOD_HOME}/${html} >> ${OUT}
      fi
    done
}

# 编译模板
#
# 参数：
#   1. 需要处理的模板文件
#   2. 输出
compile_tpl(){
    IN="$1"
    OUT="$2"

    # TODO 去掉空白之类的东东
    cp ${IN} ${OUT}
}

# 获取文件的MD5
#
# 参数：
#   1. 需要检查的文件
get_check_sum(){
    IN="$1"
    CHK_SUM=`md5sum ${IN} | awk '{print $1}'`
    echo ${CHK_SUM}
}

gen_check_sum(){
  IN="$1"
  NAME=`echo "${IN}" | cut -d'.' -f1`
  EXTENSION=`echo "${IN}" | cut -d'.' -f2`
  
  CHK_SUM=`get_check_sum ${IN}`
  cp ${IN} ${NAME}-${CHK_SUM}.${EXTENSION}
}

# 开始部署
deploy(){
    # 生成临时的release.html，供测试压缩之后的版本
    cp -r main.html index.html favicon.ico robots.txt ${BUILD_HOME}
    cp -r assets/history.html ${BUILD_HOME}/assets/history.html
    cp -r assets/img ${BUILD_HOME}/assets/img
    cp -r assets/flash ${BUILD_HOME}/assets/flash
    cp -r bin ${BUILD_HOME}
    if [ "${USER}" = "work" -o "${USER}" = "scmpf" ]; then
      # 开发机器上面的cp版本有点儿老
      cp -r -i --reply=no assets/js/* ${BUILD_HOME}/assets/js
      cp -r -i --reply=no assets/css/* ${BUILD_HOME}/assets/css
    else
      cp -r -n assets/js/* ${BUILD_HOME}/assets/js
      cp -r -n assets/css/* ${BUILD_HOME}/assets/css
    fi
    
    # 计算tpl.html的MD5，并更新dn.js里面对应的内容
    TPL_MD5=`get_check_sum ${BUILD_HOME}/assets/tpl.html`
    HISTORY_MD5=`get_check_sum ${BUILD_HOME}/assets/history.html`
    sed -i \
        -e "s@/assets/tpl.html@/assets/tpl-${TPL_MD5}.html@g" \
        -e "s@/assets/history.html@/assets/history-${HISTORY_MD5}.html@g" \
        -e "s/@BUILD_TIME@/${BUILD_TIME}/g" \
        -e "s/@BUILD_VERSION@/${BUILD_VERSION}/g" \
        ${BUILD_HOME}/assets/js/dn.js \
        ${BUILD_HOME}/assets/js/clientdn.js

    # 生成新的文件
    find ${BUILD_HOME}/assets/img/ -type d \( -name '.svn' \) -prune -o -type f -print | while read img
    do
      gen_check_sum ${img}
      FULLNAME=`basename ${img}`
      BASENAME=`echo "${FULLNAME}" | cut -d'.' -f1`
      EXTENSION=`echo "${FULLNAME}" | cut -d'.' -f2`
      CHK_SUM=`get_check_sum ${img}`
      sed -i \
          -e "s@img/${FULLNAME}@img/${BASENAME}-${CHK_SUM}.${EXTENSION}@g" \
          ${BUILD_HOME}/assets/css/dn.css
    done
    gen_check_sum ${BUILD_HOME}/assets/css/dn.css
    gen_check_sum ${BUILD_HOME}/assets/js/dn.js
    gen_check_sum ${BUILD_HOME}/assets/js/clientdn.js
    gen_check_sum ${BUILD_HOME}/assets/tpl.html
    gen_check_sum ${BUILD_HOME}/assets/history.html

    # 修改引用的地方
    JS_MD5=`get_check_sum ${BUILD_HOME}/assets/js/dn.js`
    CSS_MD5=`get_check_sum ${BUILD_HOME}/assets/css/dn.css`
    sed -i \
        -e "s/dn.*\.js/dn-${JS_MD5}\.js/g" \
        -e "s/dn.*\.css/dn-${CSS_MD5}\.css/g" \
        -e "/base\.js/d" \
        -e "s@/assets/tpl.html@/assets/tpl-${TPL_MD5}.html@g" ${BUILD_HOME}/main.html

    # if [ "${USER}" = "work" ] ; then
    #   cp -r debug.html mockup.html ${BUILD_HOME}
    #   cp -r test ${BUILD_HOME}
    # fi

    # 如果是测试机或者编译机，更新一下原始文件
    if [ "${USER}" = "work" -o "${USER}" = "scmpf" ]; then
      # TODO
      echo ''
    fi

    find ${BUILD_HOME} -type d -name ".svn" | xargs -i rm -rf {}
}


prepare

merge_js "assets/js/dn.js"
compile_js "${BUILD_HOME}/assets/js/dn.js"
#merge_js "assets/js/clientdn.js"
#compile_js "${BUILD_HOME}/assets/js/clientdn.js"

merge_css "assets/css/dn.css"
compile_css "${BUILD_HOME}/assets/css/dn.css"

merge_tpl "src/dn/config.js"

deploy

    
echo "Done."
