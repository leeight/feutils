/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/Worker.js
 * desc:    串/并行同步模块
 * author:  yuanhongliang
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

goog.require('base.EventDispatcher');

goog.provide('base.AbstractWorker');
goog.provide('base.FuncWorker');
goog.provide('base.LocalWorker');
goog.provide('base.ParallelWorkerManager');
goog.provide('base.SerialWorkerManager');
goog.provide('base.TimeoutWorker');

/**
 * @constructor
 * @extends {base.EventDispatcher}
 */
base.AbstractWorker = function() {
    base.EventDispatcher.call(this);
    this.isDone = false;
};
baidu.inherits(base.AbstractWorker, base.EventDispatcher);

base.AbstractWorker.DoneEvent = 'DONE';
base.AbstractWorker.prototype.start = function() {
    throw 'Not implemented';
};

base.AbstractWorker.prototype.done = function() {
    this.isDone = true;
    this.trigger(base.AbstractWorker.DoneEvent, this);
};

base.AbstractWorker.prototype.addDoneListener = function(listener) {
    this.addListener(base.AbstractWorker.DoneEvent, listener);
};

base.AbstractWorker.prototype.removeDoneListener = function(listener) {
    this.removeListener(base.AbstractWorker.DoneEvent, listener);
};

/**
 * 访问本地的变量
 * @constructor
 * @extends {base.AbstractWorker}
 * @param {*} data 本地的变量.
 * @param {Function} callback 回调函数，用来处理这个变量.
 */
base.LocalWorker = function(data, callback) {
  base.AbstractWorker.call(this);

  /**
   * @private
   * @type {*}
   */
  this._data = data;

  /**
   * @private
   * @type {Function}
   */
  this._callback = callback;
};
baidu.inherits(base.LocalWorker, base.AbstractWorker);

/**
 * @inheritDoc
 */
base.LocalWorker.prototype.start = function() {
  this._callback(this._data);
  this.done();
};

/**
 * 异步函数工作器
 * @constructor
 * @extends {base.AbstractWorker}
 * @param {Function} func 异步函数.
 * @param {...*} var_args 请求参数.
 */
base.FuncWorker = function(func, var_args) {
    base.AbstractWorker.call(this);

    var me = this;
    me.func = func;
    me.callback = arguments[arguments.length - 1];
    me.args = [];
    for (var i = 1; i < arguments.length - 1; i++) {
        me.args.push(arguments[i]);
    }
    me.args.push(function() {
        me.callback.apply(window, arguments);
        me.done();
    });
};
base.FuncWorker.prototype = function() {
    return {
        start: function() {
            this.func.apply(window, this.args);
        }
    };
}();
baidu.inherits(base.FuncWorker, base.AbstractWorker);

/**
 * @constructor
 * @extends {base.AbstractWorker}
 * @param {number} ms 毫秒级别.
 * @param {Function} callback 回调函数.
 */
base.TimeoutWorker = function(ms, callback) {
    base.AbstractWorker.call(this);

    this.ms = ms;
    this.callback = callback;
};
baidu.inherits(base.TimeoutWorker, base.AbstractWorker);

/** @inheritDoc */
base.TimeoutWorker.prototype.start = function() {
    var me = this;
    setTimeout(function() {
        me.callback();
        me.done();
    }, me.ms);
};

/**
 * AbstractWorkerManager
 * @constructor
 * @extends {base.AbstractWorker}
 */
base.AbstractWorkerManager = function() {
    base.AbstractWorker.call(this);

    /** @type {Array} */
    this.workers = [];
};
baidu.inherits(base.AbstractWorkerManager, base.AbstractWorker);

base.AbstractWorkerManager.prototype.addWorker = function(worker) {
    this.workers.push(worker);
    worker.addDoneListener(baidu.fn.bind(this._workerDone, this));
};

base.AbstractWorkerManager.prototype.removeWorker = function(worker) {
    for (var i = this.workers.length - 1; i >= 0; i--) {
        if (this.workers[i] === worker) {
            this.workers.splice(i, 1);
            break;
        }
    }
};

base.AbstractWorkerManager.prototype._workerDone = function(worker) {
    throw 'Not implemented';
};


/**
 * ParallelWorkerManager
 * @constructor
 * @extends {base.AbstractWorkerManager}
 */
base.ParallelWorkerManager = function() {
    base.AbstractWorkerManager.call(this);
};
base.ParallelWorkerManager.prototype = function() {
    return {
        start: function() {
            this.counter = this.workers.length;
            if (this.counter === 0) {
                this.done();
                return;
            }
            for (var i = 0; i < this.workers.length; i++) {
                if (!this.workers[i].isDone) {
                    this.workers[i].start();
                } else {
                    this._workerDone(this.workers[i]);
                }
            }
        },

        _workerDone: function(worker) {
            this.counter--;
            if (this.counter === 0) {
                this.done();
            }
        }
    };
}();
baidu.inherits(base.ParallelWorkerManager, base.AbstractWorkerManager);

/**
 * @constructor
 * @extends {base.AbstractWorkerManager}
 */
base.SerialWorkerManager = function() {
    base.AbstractWorkerManager.call(this);
};
base.SerialWorkerManager.prototype = function() {
    return {
        start: function() {
            if (this.workers.length === 0) {
                this.done();
                return;
            }
            for (var i = 0; i < this.workers.length; i++) {
                if (!this.workers[i].isDone) {
                    this.workers[i].start();
                    break;
                }
            }
        },

        _workerDone: function(worker) {
            var len = this.workers.length, i;
            if (worker === this.workers[len - 1]) {
                this.done();
            } else {
                for (i = 0; i < len - 1; i++) { // 找出完成worker的index。
                    if (this.workers[i] === worker) {
                        break;
                    }
                }
                for (i = i + 1; i < len; i++) { // 查找完成worker的下一个未完成worker，找到则start，找不到说明已全部完成。
                    if (!this.workers[i].isDone) {
                        this.workers[i].start();
                        break;
                    } else if (i === len - 1) {
                        this.done();
                    }
                }
            }
        }
    };
}();
baidu.inherits(base.SerialWorkerManager, base.AbstractWorkerManager);
