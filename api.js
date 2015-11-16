/* =============== Core =============== */
'user strict';

// Create quick reference variables for speed access to core prototypes.
var push     = Array.prototype.push,
	slice    = Array.prototype.slice,
	splice   = Array.prototype.splice,
	split	 = String.prototype.split,
	concat   = Array.prototype.concat,
	isArray  = Array.isArray,
	toString = Object.prototype.toString,
	hasOwn 	 = Object.prototype.hasOwnProperty,
	getKeys  = Object.keys,
	funcBind = Function.prototype.bind;

// Browsers prefix
var bPrefix = ['webkit','moz','ms','o'];

// Global debug mode
window.__debugMode = true;

// User Agent
if (!window._ua) {
  var _ua = navigator.userAgent.toLowerCase();
}

// Объект содержит пути к статическим файлам для загрузки
if (!window.StaticFiles) {
  var StaticFiles = {};
}

// Browser type
var browser = {
  version: (_ua.match( /.+(?:me|ox|on|rv|it|era|opr|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
  opera: (/opera/i.test(_ua) || /opr/i.test(_ua)),
  msie: (/msie/i.test(_ua) && !/opera/i.test(_ua) || /trident\//i.test(_ua)),
  msie6: (/msie 6/i.test(_ua) && !/opera/i.test(_ua)),
  msie7: (/msie 7/i.test(_ua) && !/opera/i.test(_ua)),
  msie8: (/msie 8/i.test(_ua) && !/opera/i.test(_ua)),
  msie9: (/msie 9/i.test(_ua) && !/opera/i.test(_ua)),
  mozilla: /firefox/i.test(_ua),
  chrome: /chrome/i.test(_ua),
  safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
  iphone: /iphone/i.test(_ua),
  ipod: /ipod/i.test(_ua),
  iphone4: /iphone.*OS 4/i.test(_ua),
  ipod4: /ipod.*OS 4/i.test(_ua),
  ipad: /ipad/i.test(_ua),
  android: /android/i.test(_ua),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(_ua),
  msie_mobile: /iemobile/i.test(_ua),
  safari_mobile: /iphone|ipod|ipad/i.test(_ua),
  opera_mobile: /opera mini|opera mobi/i.test(_ua),
  opera_mini: /opera mini/i.test(_ua),
  mac: /mac/i.test(_ua),
  search_bot: /(yandex|google|stackrambler|aport|slurp|msnbot|bingbot|twitterbot|ia_archiver|facebookexternalhit)/i.test(_ua)
};

var _KEY = window.KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DEL: 8,
  TAB: 9,
  RETURN: 13,
  ENTER: 13,
  ESC: 27,
  PAGEUP: 33,
  PAGEDOWN: 34,
  SPACE: 32
};

// Helpers
var help = {};
help.noop        = function () {};
help.isFunction  = function (x) {return typeof x === "function"};
help.isObject    = function (x) {return typeof x === "object" && x !== null};
help.isString	 = function (x) {return toString.call(x) === '[object String]';}
help.toObject    = function (key, val) {var x = {}; x[key] = val; return x};
help.isUndefined = function (x) {return arg === void 0};


help.isEqual = function (a, b) {
	if (a === b)return true;
    if (a === null || typeof a !== "object" || b === null || typeof b !== "object")return false;
    var len = 0, prop;
    for (prop in a)if (!help.isEqual(a[prop], b[prop]))return false; else len++;
    for (prop in b)len--;
    return 0 === len
};
help.isPlainObject = function (obj) {
	
};
help.isEmpty = function (obj) {
	if(obj == null) return true;
	if(isArray(obj) || help.isString(obj) || help.has(obj, 'callee')) return obj.length === 0;
	for(var key in obj) if (help.has(obj, key)) return false;
	return true;	
};

help.has = function (obj, key) {
	return obj != null && hasOwn.call(obj, key);
};
help.assign = function (o) {
	for (var i = 1, a = arguments, len = a.length; i < len; i++) {
		for (var prop in a[i]) if (help.has(a[i], prop)) o[prop] = a[i][prop]
	}
	return o;
};

help.classInherit = function (parentClass,  props) {
	var child = function () {
		this.constructor.apply(this, arguments)
	};
	child.extend = function (props) {
		return extend(this, props)
	};
	child.prototype = Object.create(parentClass.prototype);
	if (props) help.assign.apply(this, [child.prototype].concat(slice.call(arguments, 1)));
	return child	
};

var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

// Utils
var util = {};
util.rand 		 = function (min, max) {return Math.random() * (ma - mi + 1) + mi; }
util.irand		 = function (min, max) {return Math.floor(util.rand(mi, ma));}
util.stripHTML	 = function (text) {return text ? text.replace(/<(?:.|\s)*?>/g, '') : '';}

util.escape = function (string) {
	return string == null ? '' : String(string).replace(/[&<>"']/g, function(match) {
		return htmlEscapes[match];
	});
}
// Используем переменную для негерации уникального id
var countId = 0;
util.uniqueId = function (prefix) { 
	var id = ++countId + '';
	return prefix ? prefix + id : id;
}
util.merge = function (first, second) {
	var len = +second.length, j = 0, i = first.length;

	while ( j < len ) { first[ i++ ] = second[ j++ ];}
	// Support: IE<9
	// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
	if ( len !== len ) {
		while ( second[j] !== undefined ) {
			first[ i++ ] = second[ j++ ];
		}
	}
	first.length = i;
	return first;
};
util.trim = function (string) { return (string || '').replace(/^\s+|\s+$/g, '')};

// Array / Object util
util.inArray = function (elem, arr, i) {
	var len;
	if (arr) {
		if (indexOf) { return indexOf.call( arr, elem, i ); }

		len = arr.length;
		i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

		for ( ; i < len; i++ ) {
			if ( i in arr && arr[ i ] === elem ) { return i; }
		}
	}
	return -1;
};
util.each = function (obj, callback) {
	var name, i = 0;
	if (!util.isObject(obj) && typeof obj.length !== 'undefined') {
		for(; i < obj.length; i++) {
			var value = object[i];
      		if (callback.call(value, i, value) === false) break;
		}
	} else {
		for (name in obj) {
			if (!hasOwn.call(obj, name)) continue;
			if (callback.call(obj[name], name, obj[name]) === false) break;
		}
	}
};
util.extend = function (obj) {
	if (!help.isObject(obj)) return obj;
	var source, prop;
	for (var i = 1, length = arguments.length; i < length; i++) {
		source = arguments[i];
		for (prop in source) {
			if (hasOwn.call(source, prop)) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
};
util.indexOf = function (arr, value, from) {
	if (arr == null) return -1;
	for (var i = from || 0, l = (arr || []).length; i < l; i++) {
		if (arr[i] == value) return i;
	}
	return -1;
};
util.arrayKeyDiff =  function(a) {
  var arr_dif = {}, i = 1, argc = arguments.length, argv = arguments, key, found;
  for (key in a){
    found = false;
    for (i = 1; i < argc; i++){
      if (argv[i][key] && (argv[i][key] == a[key])){
        found = true;
      }
    }
    if (!found) {
      arr_dif[key] = a[key];
    }
  }
  return arr_dif;
};


//Style
util.getRGB = function (color) {
	var result;
	  if (color && isArray(color) && color.length == 3)
	    return color;
	  if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
	    return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
	  if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
	    return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
	  if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
	    return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
	  if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
	    return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
};
//Debug
util.debugLog = function (msg, timeout) {
	
};

util.onCtrlEnter = function(ev, handler) {
    ev = ev || window.event;
    if (ev.keyCode == 10 || ev.keyCode == 13 && (ev.ctrlKey || ev.metaKey && browser.mac)) {
        handler();
        //cancelEvent(ev);
    }
};

util.setFavIcon = function(href, force) {
    if (!window.icoNode) return;
    if (icoNode.href == href && !force) return;
    var ico = ce('link', {rel: 'shortcut icon', type: 'image/gif', href: href + '?' + ((stVersions || {}).favicon || '')});
    headNode.replaceChild(ico, icoNode);
    icoNode = ico;
};
// Dom util object
var dom = {};
dom.geById = function (el) {
	return (typeof el == 'string' || typeof el == 'number') ? document.getElementById(el) : el;
};
dom.geByTag = function (tag, node) {
	node = dom.geById(node) || document;
  	return node.getElementsByTagName(tag);
};
dom.geByClass = function (searchClass, node, tag) {
	node = dom.geById(node) || document;
	tag = tag || '*';
	return !browser.msie8 && node.querySelector && node.querySelector(tag + '.' + searchClass);
};
dom.geByClassAll = function (searchClass, node, tag) {
	node = dom.geById(node) || document;
	tag = tag || '*';
	var classElements = [];
 
	if (!browser.msie8 && node.querySelectorAll && tag != '*') {
		return node.querySelectorAll(tag + '.' + searchClass);
	}
	if (node.getElementsByClassName) {
		var nodes = node.getElementsByClassName(searchClass);
		if (tag != '*') {
			tag = tag.toUpperCase();
			for (var i = 0, l = nodes.length; i < l; ++i) {
				if (nodes[i].tagName.toUpperCase() == tag) {
					classElements.push(nodes[i]);
				}
			}
		} else {
			classElements = slice.call(nodes);
		}
		return classElements;
	}
 
	var els = dom.geByTag(tag, node);
	var pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');

	for (var i = 0, l = els.length; i < l; ++i) {
		if (pattern.test(els[i].className)) {
			classElements.push(els[i]);
		}
	}
	return classElements;
};
dom.gpeByClass = function (className, elem) {
	elem = dom.geById(elem);
	if (!elem) return null;
	while (elem = elem.parentNode) {
	if (dom.hasClass(elem, className)) return elem;}
	return null;
};
dom.ce = function (tagName, attr, style) {
	var el = document.createElement(tagName);
	if (attr) util.extend(el, attr);
	if (style) dom.setStyle(el, style);
	return el;
};
dom.el = function (el, p) {
	p = p ? 'previousSibling' : 'nextSibling';
	while (el && !el.tagName) el = el[p];
	return el;
};
dom.parent = function (el) {
	return (el || {}).parentNode;
};
dom.next = function (el) {
	return dom.el((el || {}).nextSibling);
};
dom.prev = function (el) {
	return dom.el((el || {}).previousSibling, 1);
};
dom.firstChild = function (el) {
	return dom.el((el || {}).firstChild);
};
dom.lastChild = function (el) {
	return dom.el((el || {}).lastChild, 1);
};
dom.siblings = function (el) {
	var r = [], n = (el.parentNode || {}).firstChild;
	for ( ; n; n = n.nextSibling) {
		if (n.nodeType === 1 && n !== el) r.push(n);
	}
	return r;
};
//TODO: index
dom.index = function (el) {
	/*el = dom.geById(el);
	if (el && typeof === 'string') {

	}*/
};
dom.after = function (el, node) {
    if (el && typeof node === 'string') {
        el.insertAdjacentHTML('afterend', node);
        return;
    }
    var elParent = el.parentNode;
    var elNext = el.nextSibling;

    if (elNext === null)
        elParent.appendChild(node);
    else
        elParent.insertBefore(node, elNext);
    return node;
};
dom.before = function (el, node) {
    if (el && typeof node === 'string') {
        el.insertAdjacentHTML('beforebegin', node);
    }
    if (el.parentNode && typeof node=== 'object') {
        el.parentNode.insertBefore(node, el);
    }
    return node;
};
dom.prepend = function (el, node) {
    var parent; el = dom.geById(el);
    if (el && (parent = el.parentNode)) parent.insertBefore(node, parent.firstChild);
    return node;
};
dom.replaceWith = function (el, html) {
    var parent;
    el = dom.geById(el);
    if ((parent = el.parentNode) && typeof html === 'object') parent.replaceChild(html, el);
    return html;
};
dom.htmlClear = function (el) {
    el = dom.geById(el);
    while (el.lastChild) el.removeChild(el.lastChild);
};
dom.htmlClear2 = function (el) {
    el = dom.geById(el);
    el.innerHTML = null;
};
dom.html =  function () {

};
dom.remove = function (el) {

};
dom.filter = function (arr, fn) {
    return Array.prototype.filter.call(arr, fn);
};
dom.text = function (el, text) {
    if (text === undefined) return el.textContent;
    el = dom.geById(el);
    dom.htmlClear2(el);
    el.textContent = text;
    return el;
};
dom.is = function (el, val) {
    /*var matches = function(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    };

    matches(el, '.my-class');
    el === otherEl;*/
};
dom.offset = function (el) {
    var rect = el.getBoundingClientRect();

    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
};
dom.position = function (el) {
  return {left: el.offsetLeft, top: el.offsetTop}
};
// Style classes
dom.hasClass = function (el, name) {
	el = dom.geById(el);
 	return el && (new RegExp('(\\s|^)' + name + '(\\s|$)')).test(el.className);
};
dom.addClass = function (name, el) {
	if ((el = dom.geById(el)) && !dom.hasClass(el, name)) {
		el.className = (el.className ? el.className + ' ' : '') + name;
	}
};
dom.removeClass = function (name, el) {
	name = split.call(name, ' ');
	if (el = dom.geById(el)) {
		if (name.length) {
			for (var i = 0; i < name.length; i++) {
				console.log(name[i]);
				el.className = util.trim((el.className || '').replace((new RegExp('(\\s|^)' + name[i] + '(\\s|$)')), ''));
			}
		}
		else {
			el.className = util.trim((el.className || '').replace((new RegExp('(\\s|^)' + name + '(\\s|$)')), ' '));	
		}
	}
};
dom.replaceClass = function (oldClass, newClass, el) {
	dom.removeClass(oldClass, el);
	dom.addClass(newClass, el);
};
dom.toogleClass = function (el, name, v) {
	if (v === undefined) v = !dom.hasClass(el, name);
	(v ? dom.addClass : dom.removeClass)(name, el);
};
dom.setStyle = function(elem, name, value){
  elem = dom.geById(elem);
  if (!elem) return;
  if (typeof name == 'object') return util.each(name, function(k, v) { dom.setStyle(elem,k,v); });
  if (name == 'opacity') {
    if (browser.msie) {
      if ((value + '').length) {
        if (value !== 1) {
          elem.style.filter = 'alpha(opacity=' + value * 100 + ')';
        } else {
          elem.style.filter = '';
        }
      } else {
        elem.style.cssText = elem.style.cssText.replace(/filter\s*:[^;]*/gi, '');
      }
      elem.style.zoom = 1;
    };
    elem.style.opacity = value;
  } else {
    try{
      var isN = typeof(value) == 'number';
      if (isN && (/height|width/i).test(name)) value = Math.abs(value);
      elem.style[name] = isN && !(/z-?index|font-?weight|opacity|zoom|line-?height/i).test(name) ? value + 'px' : value;
    } catch(e){util.debugLog('setStyle error: ', [name, value], e);}
  }
};

var _tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / speed;
    last = +new Date();

    if (+el.style.opacity < 1) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
};
dom.fadeIn = function(el, speed) {
    el.style.opacity = 0;
    if (el.style.display == 'none') el.style.display = '';

    var last = +new Date();
    var _tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / speed;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(_tick)) || setTimeout(_tick, 16)
        }
    };
    _tick();
};
dom.fadeOut = function(el, speed) {
    el.style.opacity = 1;

    var last = +new Date();
    var _tick = function() {
        el.style.opacity = +el.style.opacity - (new Date() - last) / speed;
        last = +new Date();

        if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(_tick)) || setTimeout(_tick, 16)
        }
    };
    _tick();
};
dom.hide = function (el) {
    el.style.display = 'none';
};
dom.show = function (el) {
    el.style.display = '';
};

/* =============== /Core =============== */

