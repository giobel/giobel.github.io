/* (c) Jonathan Gotti - licence: https://github.com/malko/d.js/LICENCE.txt @version 0.7.3*/
!function(a){"use strict";function b(a){l(function(){throw a})}function c(b){return this.then(b,a)}function d(b){return this.then(a,b)}function e(b,c){return this.then(function(a){return m(b)?b.apply(null,n(a)?a:[a]):v.onlyFuncs?a:b},c||a)}function f(a){function b(){a()}return this.then(b,b),this}function g(a){return this.then(function(b){return m(a)?a.apply(null,n(b)?b.splice(0,0,void 0)&&b:[void 0,b]):v.onlyFuncs?b:a},function(b){return a(b)})}function h(c){return this.then(a,c?function(a){throw c(a),a}:b)}function i(a,b){var c=q(a);if(1===c.length&&n(c[0])){if(!c[0].length)return v.fulfilled([]);c=c[0]}var d=[],e=v(),f=c.length;if(f)for(var g=function(a){c[a]=v.promisify(c[a]),c[a].then(function(g){d[a]=b?c[a]:g,--f||e.resolve(d)},function(g){b?(d[a]=c[a],--f||e.resolve(d)):e.reject(g)})},h=0,i=f;i>h;h++)g(h);else e.resolve(d);return e.promise}function j(a,b){return a.then(m(b)?b:function(){return b})}function k(a){var b=q(a);1===b.length&&n(b[0])&&(b=b[0]);for(var c=v(),d=0,e=b.length,f=v.resolved();e>d;d++)f=j(f,b[d]);return c.resolve(f),c.promise}var l,m=function(a){return"function"==typeof a},n=function(a){return Array.isArray?Array.isArray(a):a instanceof Array},o=function(a){return!(!a||!(typeof a).match(/function|object/))},p=function(b){return b===!1||b===a||null===b},q=function(a,b){return[].slice.call(a,b)},r="undefined",s=typeof TypeError===r?Error:TypeError;if(typeof process!==r&&process.nextTick)l=process.nextTick;else if(typeof MessageChannel!==r){var t=new MessageChannel,u=[];t.port1.onmessage=function(){u.length&&u.shift()()},l=function(a){u.push(a),t.port2.postMessage(0)}}else l=function(a){setTimeout(a,0)};var v=function(b){function i(){if(0!==r){var a,b=t,c=0,d=b.length,e=~r?0:1;for(t=[];d>c;c++)(a=b[c][e])&&a(n)}}function j(a){function b(a){return function(b){return c?void 0:(c=!0,a(b))}}var c=!1;if(r)return this;try{var d=o(a)&&a.then;if(m(d)){if(a===u)throw new s("Promise can't resolve itself");return d.call(a,b(j),b(k)),this}}catch(e){return b(k)(e),this}return q(function(){n=a,r=1,i()}),this}function k(a){return r||q(function(){try{throw a}catch(b){n=b}r=-1,i()}),this}var n,q=(a!==b?b:v.alwaysAsync)?l:function(a){a()},r=0,t=[],u={then:function(a,b){var c=v();return t.push([function(b){try{c.resolve(p(a)?b:m(a)?a(b):v.onlyFuncs?b:a)}catch(d){c.reject(d)}},function(a){if((p(b)||!m(b)&&v.onlyFuncs)&&c.reject(a),b)try{c.resolve(m(b)?b(a):b)}catch(d){c.reject(d)}}]),0!==r&&q(i),c.promise},success:c,error:d,otherwise:d,apply:e,spread:e,ensure:f,nodify:g,rethrow:h,isPending:function(){return 0===r},getStatus:function(){return r}};return u.toSource=u.toString=u.valueOf=function(){return n===a?this:n},{promise:u,resolve:j,fulfill:j,reject:k}};if(v.deferred=v.defer=v,v.nextTick=l,v.alwaysAsync=!0,v.onlyFuncs=!0,v.resolved=v.fulfilled=function(a){return v(!0).resolve(a).promise},v.rejected=function(a){return v(!0).reject(a).promise},v.wait=function(a){var b=v();return setTimeout(b.resolve,a||0),b.promise},v.delay=function(a,b){var c=v();return setTimeout(function(){try{c.resolve(m(a)?a.apply(null):a)}catch(b){c.reject(b)}},b||0),c.promise},v.promisify=function(a){return a&&m(a.then)?a:v.resolved(a)},v.all=function(){return i(arguments,!1)},v.resolveAll=function(){return i(arguments,!0)},v.sequence=function(){return k(arguments)},v.nodeCapsule=function(a,b){return b||(b=a,a=void 0),function(){var c=v(),d=q(arguments);d.push(function(a,b){a?c.reject(a):c.resolve(arguments.length>2?q(arguments,1):b)});try{b.apply(a,d)}catch(e){c.reject(e)}return c.promise}},"function"==typeof define&&define.amd)define("D.js",[],function(){return v});else if(typeof module!==r&&module.exports)module.exports=v;else if(typeof window!==r){var w=window.D;v.noConflict=function(){return window.D=w,v},window.D=v}}();