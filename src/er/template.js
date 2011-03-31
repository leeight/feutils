/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * template.js ~ 2011/03/25 00:14:38
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * er.template
 **/

goog.require('er.base');

goog.provide('er.template');

/**
 * @constructor
 * 简易的模板解析器
 */
er.Template = function() {
  this.container = {};
};

/**
 * 解析模板变量的值。现在实际上只做字符串的静态绑定。
 *
 * @private
 * @param {string} varName 变量名.
 * @return {string} 变量的值.
 */
er.Template.prototype.parseVariable = function(varName) {
  var match = varName.match(/:([a-z]+)$/);
  if (match && match.length > 1) {
    return this.parseVariableByType(
      varName.replace(/:[a-z]+$/i, ''), match[1]);
  }

  return '';
};

/**
 * 解析带有类型的模板变量的值
 *
 * @private
 * @param {string} varName 变量名.
 * @param {string} type 变量类型，暂时为lang|config.
 * @return {string} 变量的值.
 */
er.Template.prototype.parseVariableByType = function(varName, type) {
  var variable;

  type = type.toLowerCase();
  if (type === 'lang' || type === 'config') {
      // TODO：和dn解耦
      variable = dn[type][varName];
  } else {
      throw 'Not handled';
  }

  if (er.base.hasValue(variable)) {
      return variable;
  }

  return '';
};

/**
 * 获取指定模板target的HTML片段
 *
 * @param {string} target HTML片段的名称.
 * @return {string} HTML片段.
 */
er.Template.prototype.get = function(target) {
  return this.container[target] || '';
};

/**
 * 获取指定模板合并后的内容
 *
 * @param {string} view 模板名称.
 * @return {string} 合并之后的内容.
 */
er.Template.prototype.getMerged = function(view) {
  var me = this;
  return me.get(view).replace(
          /\$\{([.:a-z0-9_]+)\}/ig,
          function($0, $1) {
            return me.parseVariable($1);
          });
};

/**
 * 合并模板与数据
 *
 * @param {Element} output  要输出到的容器元素.
 * @param {string} view  视图模板.
 */
er.Template.prototype.merge = function(output, view) {
  if (output) {
    output.innerHTML = this.getMerged(view);
  }
};

/**
 * 解析模板
 *
 * @param {string} source 模板源.
 */
er.Template.prototype.parse = function(source) {
    var lines = source.split(/\r?\n/),
        linesLen = lines.length,
        linesIndex = 0,
        targetStartRule = /<!--\s*target:\s*([a-zA-Z0-9]+)\s*-->/,
        targetEndRule = /<!--\s*\/target\s*-->/,
        importRule = /<!--\s*import:\s*([a-zA-Z0-9]+)\s*-->/,
        key,
        line,
        segment,
        match,
        container = this.container,
        current = [],
        currentName, tempName,
        currentContainer = {};

    // 逐行读取解析target
    for (; linesIndex < linesLen; linesIndex++) {
        line = lines[linesIndex];

        if (line.length <= 0) {
            continue;
        }

        targetStartRule.lastIndex = -1;
        if (match = targetStartRule.exec(line)) {
            // 开始target的读取
            tempName = match[1];
            segment = line.split(targetStartRule);
            addLine(segment[0]);
            addTpl();
            current = [];
            currentName = tempName;
            addLine(segment[2]);

        } else if (targetEndRule.test(line)) {
            // 结束target的读取
            segment = line.split(targetEndRule);
            addLine(segment[0]);
            addTpl();

        } else {
            addLine(line);
        }
    }
    addTpl();

    // 解析import
    for (key in currentContainer) {
      if (container[key]) {
        alert('Template: ' + key + ' already exists!');
      }
      container[key] = parseImport(currentContainer[key]);
    }

    /**
     * 解析import
     * @param {string} source HTML片段的名称.
     * @return {string} source解析之后的内容.
     */
    function parseImport(source) {
      if (importRule.test(source)) {
        return parseImport(source.replace(importRule,
          function($0, $1) {
            return currentContainer[$1] ||
                   container[$1] ||
                   '';
          }
        ));
      }

      return source;
    }

    /**
      * 向临时容器里添加行
      *
      * @param {string} str 当前行的html代码.
      */
    function addLine(str) {
      if (str && currentName) {
        current.push(str);
      }
    }

    /**
     * 将当前读出字符添加到模板变量
     */
    function addTpl() {
      if (currentName) {
        if (currentName in currentContainer) {
          alert('Template: ' + currentName + ' is exist');
        } else {
          currentContainer[currentName] = current.join('\n');
        }
      }
      currentName = null;
    }
};

// instance
er.template = new er.Template();




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
