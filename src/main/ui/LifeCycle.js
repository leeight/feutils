goog.require("ui");

goog.provide("ui.lifeCycle");

/**
 * ui的生命周期定义
 * @enum {number}
 */
ui.lifeCycle = {

    CONSTRUCTED: 0,

    INITIALIZED: 1,

    MODEL_BOUND: 2,

    RENDERED: 3,

    EVENT_BOUND: 4,

    DISPOSED: 5
};
