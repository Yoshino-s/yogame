/* eslint-disable */export default (function(){function r(r){var f,u;if(r&&typeof r==="object"&&!Array.isArray(r)){f=r.type;if(f!==undefined){u=e(f);if(u!==0){return u.concat(1)}}else{return[2]}f=r.version;if(f!==undefined){u=n(f);if(u!==0){return u.concat(3)}}else{return[4]}f=r.metadata;if(f!==undefined){u=t(f);if(u!==0){return u.concat(5)}}else{return[6]}f=r.tileset;if(f!==undefined){u=i(f);if(u!==0){return u.concat(7)}}else{return[8]}}if(!r||typeof r!=="object"||Array.isArray(r)){return[9]}return 0}function e(r){var e;e=0;if(r==="yogame-tileset"){e++}if(e===0){return[10]}if(typeof r!=="string"){return[11]}return 0}function n(r){if(typeof r!=="string"){return[12]}return 0}function t(r){var e,t;if(r&&typeof r==="object"&&!Array.isArray(r)){e=r.id;if(e!==undefined){t=n(e);if(t!==0){return t.concat(13)}}else{return[14]}e=r.texture;if(e!==undefined){t=n(e);if(t!==0){return t.concat(15)}}else{return[16]}}if(!r||typeof r!=="object"||Array.isArray(r)){return[17]}return 0}function i(r){var e;if(Array.isArray(r)){e=0;for(;e<r.length;e++){if(f(r[e])!==0){return[18]}}}if(!Array.isArray(r)){return[19]}return 0}function f(r){var e,t;if(r&&typeof r==="object"&&!Array.isArray(r)){e=r.id;if(e!==undefined){t=n(e);if(t!==0){return t.concat(20)}}else{return[21]}e=r.data;if(e!==undefined){t=n(e);if(t!==0){return t.concat(22)}}e=r.texture;if(e!==undefined){t=n(e);if(t!==0){return t.concat(23)}}else{return[24]}e=r.type;if(e!==undefined){t=u(e);if(t!==0){return t.concat(25)}}else{return[26]}e=r.collide;if(e!==undefined){t=o(e);if(t!==0){return t.concat(27)}}else{return[28]}}if(!r||typeof r!=="object"||Array.isArray(r)){return[29]}return 0}function u(r){var e;e=0;if(r==="cell"){e++}if(r==="decorate"){e++}if(r==="floor"){e++}if(r==="object"){e++}if(r==="wall"){e++}if(e===0){return[30]}if(typeof r!=="string"){return[31]}return 0}function o(r){var e;e=0;if(r==="fill"){e++}if(r==="none"){e++}if(e===0){return[32]}if(typeof r!=="string"){return[33]}return 0}return{root:r}})();