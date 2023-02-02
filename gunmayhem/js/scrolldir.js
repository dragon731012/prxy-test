/**
 * scrolldir - Vertical scroll direction in CSS
 * @version v1.2.22
 * @link https://github.com/dollarshaveclub/scrolldir.git
 * @author Patrick Fisher <patrick@pwfisher.com>
 * @license MIT
**/

window.global_up_down_scroll = 'down';

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.scrollDir = factory());
}(this, (function() {
    'use strict';
	
    var attribute = 'data-scrolldir';
    var dir = 'down'; // 'up' or 'down'
    var el = document.documentElement;
    var win = window;
    var body = document.body;
    var historyLength = 32; // Ticks to keep in history.
    var historyMaxAge = 512; // History data time-to-live (ms).
    var thresholdPixels = 64; // Ignore moves smaller than this.
    var history = Array(historyLength);
    var e = void 0; // last scroll event
    var pivot = void 0; // "high-water mark"
    var pivotTime = 0;

    function tick() {
        var y = win.scrollY || win.pageYOffset;
        var t = e.timeStamp;
        var furthest = dir === 'down' ? Math.max : Math.min;

        // Apply bounds to handle rubber banding
        var yMax = body.offsetHeight - win.innerHeight;
        y = Math.max(0, y);
        y = Math.min(yMax, y);

        // Update history
        history.unshift({
            y: y,
            t: t
        });
        history.pop();

        // Are we continuing in the same direction?
        if (y === furthest(pivot, y)) {
            // Update "high-water mark" for current direction
            pivotTime = t;
            pivot = y;
            return;
        }
        // else we have backed off high-water mark

        // Apply max age to find current reference point
        var cutoffTime = t - historyMaxAge;
        if (cutoffTime > pivotTime) {
            pivot = y;
            for (var i = 0; i < historyLength; i += 1) {
                if (!history[i] || history[i].t < cutoffTime) break;
                pivot = furthest(pivot, history[i].y);
            }
        }

        // Have we exceeded threshold?
        if (Math.abs(y - pivot) > thresholdPixels) {
            pivot = y;
            pivotTime = t;
            dir = dir === 'down' ? 'up' : 'down';
            el.setAttribute(attribute, dir);
			window.global_up_down_scroll = dir;
        }
    }

    function handler(event) {
        e = event;
        return win.requestAnimationFrame(tick);
    }

    function scrollDir(opts) {
        if (opts) {
            if (opts.attribute) attribute = opts.attribute;
            if (opts.el) el = opts.el;
            if (opts.win) win = opts.win;
            if (opts.dir) dir = opts.dir;
            // If opts.off, turn it off
            // - set html[data-scrolldir="off"]
            // - remove the event listener
            if (opts.off === true) {
                el.setAttribute(attribute, 'off');
                return win.removeEventListener('scroll', handler);
            }
        }

        // else, turn it on
        // - set html[data-scrolldir="down"]
        // - add the event listener
        pivot = win.scrollY || win.pageYOffset;
        el.setAttribute(attribute, dir);
        return win.addEventListener('scroll', handler);
    }

    return scrollDir;

})));

//http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
//requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
//MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());