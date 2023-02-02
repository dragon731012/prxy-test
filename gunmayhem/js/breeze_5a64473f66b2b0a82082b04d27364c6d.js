/**
 * scrolldir - Vertical scroll direction in CSS
 * @version v1.2.22
 * @link https://github.com/dollarshaveclub/scrolldir.git
 * @author Patrick Fisher <patrick@pwfisher.com>
 * @license MIT
**/
window.global_up_down_scroll='down';(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global.scrollDir=factory())}(this,(function(){'use strict';var attribute='data-scrolldir';var dir='down';var el=document.documentElement;var win=window;var body=document.body;var historyLength=32;var historyMaxAge=512;var thresholdPixels=64;var history=Array(historyLength);var e=void 0;var pivot=void 0;var pivotTime=0;function tick(){var y=win.scrollY||win.pageYOffset;var t=e.timeStamp;var furthest=dir==='down'?Math.max:Math.min;var yMax=body.offsetHeight-win.innerHeight;y=Math.max(0,y);y=Math.min(yMax,y);history.unshift({y:y,t:t});history.pop();if(y===furthest(pivot,y)){pivotTime=t;pivot=y;return}
var cutoffTime=t-historyMaxAge;if(cutoffTime>pivotTime){pivot=y;for(var i=0;i<historyLength;i+=1){if(!history[i]||history[i].t<cutoffTime)break;pivot=furthest(pivot,history[i].y)}}
if(Math.abs(y-pivot)>thresholdPixels){pivot=y;pivotTime=t;dir=dir==='down'?'up':'down';el.setAttribute(attribute,dir);window.global_up_down_scroll=dir}}
function handler(event){e=event;return win.requestAnimationFrame(tick)}
function scrollDir(opts){if(opts){if(opts.attribute)attribute=opts.attribute;if(opts.el)el=opts.el;if(opts.win)win=opts.win;if(opts.dir)dir=opts.dir;if(opts.off===!0){el.setAttribute(attribute,'off');return win.removeEventListener('scroll',handler)}}
pivot=win.scrollY||win.pageYOffset;el.setAttribute(attribute,dir);return win.addEventListener('scroll',handler)}
return scrollDir})));(function(){var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame']}
if(!window.requestAnimationFrame)
window.requestAnimationFrame=function(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall)},timeToCall);lastTime=currTime+timeToCall;return id};if(!window.cancelAnimationFrame)
window.cancelAnimationFrame=function(id){clearTimeout(id)}}())