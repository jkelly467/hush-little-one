Array.prototype.transpose = function(){
   
   var a = this,
   w = a.length ? a.length : 0,
   h = a[0] instanceof Array ? a[0].length : 0;

   if (h===0 || w===0) {return []}

   var i,j,t=[];

   for(i=0;i<h;i++){
      t[i] = []
      for(j=0;j<w;j++){
         t[i][j] = a[j][i]
      }
   }
   return t
}

displayMap = function(map){
   var i = map.length
   while(i--){
      console.log("["+i+"]:"+map[i])
   }
}

/*
	This is rot.js, the ROguelike Toolkit in JavaScript.
	Version 0.4~dev, generated on Thu Mar  7 20:57:44 CST 2013.
*/

/**
 * @namespace Top-level ROT namespace
 */
var ROT = {
	/**
	 * @returns {bool} Is rot.js supported by this browser?
	 */
	isSupported: function() {
		return !!(document.createElement("canvas").getContext && Function.prototype.bind);
	},

	/** Default with for display and map generators */
	DEFAULT_WIDTH: 80,
	/** Default height for display and map generators */
	DEFAULT_HEIGHT: 25,

	/** Directional constants. Ordering is important! */
	DIRS: {
		"4": [
			[ 0, -1],
			[ 1,  0],
			[ 0,  1],
			[-1,  0]
		],
		"8": [
			[ 0, -1],
			[ 1, -1],
			[ 1,  0],
			[ 1,  1],
			[ 0,  1],
			[-1,  1],
			[-1,  0],
			[-1, -1]
		],
		"6": [
			[-1, -1],
			[ 1, -1],
			[ 2,  0],
			[ 1,  1],
			[-1,  1],
			[-2,  0]
		]
	},

	/** Cancel key. */
	VK_CANCEL: 3, 
	/** Help key. */
	VK_HELP: 6, 
	/** Backspace key. */
	VK_BACK_SPACE: 8, 
	/** Tab key. */
	VK_TAB: 9, 
	/** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
	VK_CLEAR: 12, 
	/** Return/enter key on the main keyboard. */
	VK_RETURN: 13, 
	/** Reserved, but not used. */
	VK_ENTER: 14, 
	/** Shift key. */
	VK_SHIFT: 16, 
	/** Control key. */
	VK_CONTROL: 17, 
	/** Alt (Option on Mac) key. */
	VK_ALT: 18, 
	/** Pause key. */
	VK_PAUSE: 19, 
	/** Caps lock. */
	VK_CAPS_LOCK: 20, 
	/** Escape key. */
	VK_ESCAPE: 27, 
	/** Space bar. */
	VK_SPACE: 32, 
	/** Page Up key. */
	VK_PAGE_UP: 33, 
	/** Page Down key. */
	VK_PAGE_DOWN: 34, 
	/** End key. */
	VK_END: 35, 
	/** Home key. */
	VK_HOME: 36, 
	/** Left arrow. */
	VK_LEFT: 37, 
	/** Up arrow. */
	VK_UP: 38, 
	/** Right arrow. */
	VK_RIGHT: 39, 
	/** Down arrow. */
	VK_DOWN: 40, 
	/** Print Screen key. */
	VK_PRINTSCREEN: 44, 
	/** Ins(ert) key. */
	VK_INSERT: 45, 
	/** Del(ete) key. */
	VK_DELETE: 46, 
	/***/
	VK_0: 48,
	/***/
	VK_1: 49,
	/***/
	VK_2: 50,
	/***/
	VK_3: 51,
	/***/
	VK_4: 52,
	/***/
	VK_5: 53,
	/***/
	VK_6: 54,
	/***/
	VK_7: 55,
	/***/
	VK_8: 56,
	/***/
	VK_9: 57,
	/** Colon (:) key. Requires Gecko 15.0 */
	VK_COLON: 58, 
	/** Semicolon (;) key. */
	VK_SEMICOLON: 59, 
	/** Less-than (<) key. Requires Gecko 15.0 */
	VK_LESS_THAN: 60, 
	/** Equals (=) key. */
	VK_EQUALS: 61, 
	/** Greater-than (>) key. Requires Gecko 15.0 */
	VK_GREATER_THAN: 62, 
	/** Question mark (?) key. Requires Gecko 15.0 */
	VK_QUESTION_MARK: 63, 
	/** Atmark (@) key. Requires Gecko 15.0 */
	VK_AT: 64, 
	/***/
	VK_A: 65,
	/***/
	VK_B: 66,
	/***/
	VK_C: 67,
	/***/
	VK_D: 68,
	/***/
	VK_E: 69,
	/***/
	VK_F: 70,
	/***/
	VK_G: 71,
	/***/
	VK_H: 72,
	/***/
	VK_I: 73,
	/***/
	VK_J: 74,
	/***/
	VK_K: 75,
	/***/
	VK_L: 76,
	/***/
	VK_M: 77,
	/***/
	VK_N: 78,
	/***/
	VK_O: 79,
	/***/
	VK_P: 80,
	/***/
	VK_Q: 81,
	/***/
	VK_R: 82,
	/***/
	VK_S: 83,
	/***/
	VK_T: 84,
	/***/
	VK_U: 85,
	/***/
	VK_V: 86,
	/***/
	VK_W: 87,
	/***/
	VK_X: 88,
	/***/
	VK_Y: 89,
	/***/
	VK_Z: 90,
	/***/
	VK_CONTEXT_MENU: 93,
	/** 0 on the numeric keypad. */
	VK_NUMPAD0: 96, 
	/** 1 on the numeric keypad. */
	VK_NUMPAD1: 97, 
	/** 2 on the numeric keypad. */
	VK_NUMPAD2: 98, 
	/** 3 on the numeric keypad. */
	VK_NUMPAD3: 99, 
	/** 4 on the numeric keypad. */
	VK_NUMPAD4: 100, 
	/** 5 on the numeric keypad. */
	VK_NUMPAD5: 101, 
	/** 6 on the numeric keypad. */
	VK_NUMPAD6: 102, 
	/** 7 on the numeric keypad. */
	VK_NUMPAD7: 103, 
	/** 8 on the numeric keypad. */
	VK_NUMPAD8: 104, 
	/** 9 on the numeric keypad. */
	VK_NUMPAD9: 105, 
	/** * on the numeric keypad. */
	VK_MULTIPLY: 106,
	/** + on the numeric keypad. */
	VK_ADD: 107, 
	/***/
	VK_SEPARATOR: 108,
	/** - on the numeric keypad. */
	VK_SUBTRACT: 109, 
	/** Decimal point on the numeric keypad. */
	VK_DECIMAL: 110, 
	/** / on the numeric keypad. */
	VK_DIVIDE: 111, 
	/** F1 key. */
	VK_F1: 112, 
	/** F2 key. */
	VK_F2: 113, 
	/** F3 key. */
	VK_F3: 114, 
	/** F4 key. */
	VK_F4: 115, 
	/** F5 key. */
	VK_F5: 116, 
	/** F6 key. */
	VK_F6: 117, 
	/** F7 key. */
	VK_F7: 118, 
	/** F8 key. */
	VK_F8: 119, 
	/** F9 key. */
	VK_F9: 120, 
	/** F10 key. */
	VK_F10: 121, 
	/** F11 key. */
	VK_F11: 122, 
	/** F12 key. */
	VK_F12: 123, 
	/** F13 key. */
	VK_F13: 124, 
	/** F14 key. */
	VK_F14: 125, 
	/** F15 key. */
	VK_F15: 126, 
	/** F16 key. */
	VK_F16: 127, 
	/** F17 key. */
	VK_F17: 128, 
	/** F18 key. */
	VK_F18: 129, 
	/** F19 key. */
	VK_F19: 130, 
	/** F20 key. */
	VK_F20: 131, 
	/** F21 key. */
	VK_F21: 132, 
	/** F22 key. */
	VK_F22: 133, 
	/** F23 key. */
	VK_F23: 134, 
	/** F24 key. */
	VK_F24: 135, 
	/** Num Lock key. */
	VK_NUM_LOCK: 144, 
	/** Scroll Lock key. */
	VK_SCROLL_LOCK: 145, 
	/** Circumflex (^) key. Requires Gecko 15.0 */
	VK_CIRCUMFLEX: 160, 
	/** Exclamation (!) key. Requires Gecko 15.0 */
	VK_EXCLAMATION: 161, 
	/** Double quote () key. Requires Gecko 15.0 */
	VK_DOUBLE_QUOTE: 162, 
	/** Hash (#) key. Requires Gecko 15.0 */
	VK_HASH: 163, 
	/** Dollar sign ($) key. Requires Gecko 15.0 */
	VK_DOLLAR: 164, 
	/** Percent (%) key. Requires Gecko 15.0 */
	VK_PERCENT: 165, 
	/** Ampersand (&) key. Requires Gecko 15.0 */
	VK_AMPERSAND: 166, 
	/** Underscore (_) key. Requires Gecko 15.0 */
	VK_UNDERSCORE: 167, 
	/** Open parenthesis (() key. Requires Gecko 15.0 */
	VK_OPEN_PAREN: 168, 
	/** Close parenthesis ()) key. Requires Gecko 15.0 */
	VK_CLOSE_PAREN: 169, 
	/* Asterisk (*) key. Requires Gecko 15.0 */
	VK_ASTERISK: 170,
	/** Plus (+) key. Requires Gecko 15.0 */
	VK_PLUS: 171, 
	/** Pipe (|) key. Requires Gecko 15.0 */
	VK_PIPE: 172, 
	/** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
	VK_HYPHEN_MINUS: 173, 
	/** Open curly bracket ({) key. Requires Gecko 15.0 */
	VK_OPEN_CURLY_BRACKET: 174, 
	/** Close curly bracket (}) key. Requires Gecko 15.0 */
	VK_CLOSE_CURLY_BRACKET: 175, 
	/** Tilde (~) key. Requires Gecko 15.0 */
	VK_TILDE: 176, 
	/** Comma (,) key. */
	VK_COMMA: 188, 
	/** Period (.) key. */
	VK_PERIOD: 190, 
	/** Slash (/) key. */
	VK_SLASH: 191, 
	/** Back tick (`) key. */
	VK_BACK_QUOTE: 192, 
	/** Open square bracket ([) key. */
	VK_OPEN_BRACKET: 219, 
	/** Back slash (\) key. */
	VK_BACK_SLASH: 220, 
	/** Close square bracket (]) key. */
	VK_CLOSE_BRACKET: 221, 
	/** Quote (''') key. */
	VK_QUOTE: 222, 
	/** Meta key on Linux, Command key on Mac. */
	VK_META: 224, 
	/** AltGr key on Linux. Requires Gecko 15.0 */
	VK_ALTGR: 225, 
	/** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
	VK_WIN: 91, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_KANA: 21, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_HANGUL: 21, 
	/** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
	VK_EISU: 22, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_JUNJA: 23, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_FINAL: 24, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_HANJA: 25, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_KANJI: 25, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_CONVERT: 28, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_NONCONVERT: 29, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_ACCEPT: 30, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_MODECHANGE: 31, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_SELECT: 41, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_PRINT: 42, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_EXECUTE: 43, 
	/** Linux support for this keycode was added in Gecko 4.0.	 */
	VK_SLEEP: 95 
};
/**
 * @returns {any} Randomly picked item, null when length=0
 */
Array.prototype.random = function() {
	if (!this.length) { return null; }
	return this[Math.floor(ROT.RNG.getUniform() * this.length)];
}

/**
 * @returns {array} New array with randomized items
 * FIXME destroys this!
 */
Array.prototype.randomize = function() {
	var result = [];
	while (this.length) {
		var index = this.indexOf(this.random());
		result.push(this.splice(index, 1)[0]);
	}
	return result;
}
if (!Date.now) { 
	/**
	 * @returns {int} Current timestamp (msec)
	 */
	Date.now = function() { return +(new Date); } 
}
/**
 * Always positive modulus
 * @param {int} n Modulus
 * @returns {int} this modulo n
 */
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}
/**
 * @returns {string} First letter capitalized
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.substring(1);
}

/** 
 * Left pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.lpad = function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return s+this;
}

/** 
 * Right pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.rpad = function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return this+s;
}

/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
String.format = function(template) {
	var map = String.format.map;
	var args = Array.prototype.slice.call(arguments, 1);

	var replacer = function(match, group1, group2, index) {
		if (template.charAt(index-1) == "%" || !args.length) { return match; }
		var obj = args[0];

		var group = group1 || group2;
		var parts = group.split(",");
		var name = parts.shift();
		var method = map[name.toLowerCase()];
		if (!method) { return match; }

		var obj = args.shift();
		var replaced = obj[method].apply(obj, parts);

		var first = name.charAt(0);
		if (first != first.toLowerCase()) { replaced = replaced.capitalize(); }

		return replaced;
	}
	return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}

String.format.map = {
	"s": "toString"
}

/**
 * Convenience shortcut to String.format(this)
 */
String.prototype.format = function() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this);
	return String.format.apply(String, args);
}

if (!Object.create) {  
	/**
	 * ES5 Object.create
	 */
	Object.create = function(o) {  
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};  
}  
/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
Function.prototype.extend = function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	return this;
}
/**
 * @namespace
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
ROT.RNG = {
	/**
	 * @returns {number} 
	 */
	getSeed: function() {
		return this._seed;
	},

	/**
	 * @param {number} seed Seed the number generator
	 */
	setSeed: function(seed) {
		seed = (seed < 1 ? 1/seed : seed);

		this._seed = seed;
		this._s0 = (seed >>> 0) * this._frac;

		seed = (seed*69069 + 1) >>> 0;
		this._s1 = seed * this._frac;

		seed = (seed*69069 + 1) >>> 0;
		this._s2 = seed * this._frac;

		this._c = 1;
		return this;
	},

	/**
	 * @returns {float} Pseudorandom value [0,1), uniformly distributed
	 */
	getUniform: function() {
		var t = 2091639 * this._s0 + this._c * this._frac;
		this._s0 = this._s1;
		this._s1 = this._s2;
		this._c = t | 0;
		this._s2 = t - this._c;
		return this._s2;
	},

	/**
	 * @param {float} [mean=0] Mean value
	 * @param {float} [stddev=1] Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
	 * @returns {float} A normally distributed pseudorandom value
	 */
	getNormal: function(mean, stddev) {
		do {
			var u = 2*this.getUniform()-1;
			var v = 2*this.getUniform()-1;
			var r = u*u + v*v;
		} while (r > 1 || r == 0);

		var gauss = u * Math.sqrt(-2*Math.log(r)/r);
		return (mean || 0) + gauss*(stddev || 1);
	},

	/**
	 * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
	 */
	getPercentage: function() {
		return 1 + Math.floor(this.getUniform()*100);
	},
	
	/**
	 * @param {object} data key=whatever, value=weight (relative probability)
	 * @returns {string} whatever
	 */
	getWeightedValue: function(data) {
		var avail = [];
		var total = 0;
		
		for (var id in data) {
			total += data[id];
		}
		var random = Math.floor(this.getUniform()*total);
		
		var part = 0;
		for (var id in data) {
			part += data[id];
			if (random < part) { return id; }
		}
		
		return null;
	},

	/**
	 * Get RNG state. Useful for storing the state and re-setting it via setState.
	 * @returns {?} Internal state
	 */
	getState: function() {
		return [this._s0, this._s1, this._s2, this._c];
	},

	/**
	 * Set a previously retrieved state.
	 * @param {?} state
	 */
	setState: function(state) {
		this._s0 = state[0];
		this._s1 = state[1];
		this._s2 = state[2];
		this._c  = state[3];
		return this;
	},

	_s0: 0,
	_s1: 0,
	_s2: 0,
	_c: 0,
	_frac: 2.3283064365386963e-10 /* 2^-32 */
}

ROT.RNG.setSeed(Date.now());
/**
 * @class Base map generator
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 */
ROT.Map = function(width, height) {
	this._width = width || ROT.DEFAULT_WIDTH;
	this._height = height || ROT.DEFAULT_HEIGHT;
};

ROT.Map.prototype.create = function(callback) {}

ROT.Map.prototype._fillMap = function(value) {
	var map = [];
	for (var i=0;i<this._width;i++) {
		map.push([]);
		for (var j=0;j<this._height;j++) { map[i].push(value); }
	}
	return map;
}
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
ROT.Map.Cellular = function(width, height, options) {
	ROT.Map.call(this, width, height);
	this._options = {
		born: [5, 6, 7, 8],
		survive: [4, 5, 6, 7, 8],
		topology: 8
	};
	for (var p in options) { this._options[p] = options[p]; }
	
	this._dirs = ROT.DIRS[this._options.topology];
	this._map = this._fillMap(0);
}
ROT.Map.Cellular.extend(ROT.Map);

/**
 * Fill the map with random values
 * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
 */
ROT.Map.Cellular.prototype.randomize = function(probability) {
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			this._map[i][j] = (ROT.RNG.getUniform() < probability ? 1 : 0);
		}
	}
	return this;
}

ROT.Map.Cellular.prototype.set = function(x, y, value) {
	this._map[x][y] = value;
}

ROT.Map.Cellular.prototype.create = function(callback) {
	var newMap = this._fillMap(0);
	var born = this._options.born;
	var survive = this._options.survive;


	for (var j=0;j<this._height;j++) {
		var widthStep = 1;
		var widthStart = 0;
		if (this._options.topology == 6) { 
			widthStep = 2;
			widthStart = j%2;
		}

		for (var i=widthStart; i<this._width; i+=widthStep) {

			var cur = this._map[i][j];
			var ncount = this._getNeighbors(i, j);
			
			if (cur && survive.indexOf(ncount) != -1) { /* survive */
				newMap[i][j] = 1;
			} else if (!cur && born.indexOf(ncount) != -1) { /* born */
				newMap[i][j] = 1;
			}
			
			if (callback) { callback(i, j, newMap[i][j]); }
		}
	}
	
	this._map = newMap;
}

/**
 * Get neighbor count at [i,j] in this._map
 */
ROT.Map.Cellular.prototype._getNeighbors = function(cx, cy) {
	var result = 0;
	for (var i=0;i<this._dirs.length;i++) {
		var dir = this._dirs[i];
		var x = cx + dir[0];
		var y = cy + dir[1];
		
		if (x < 0 || x >= this._width || x < 0 || y >= this._width) { continue; }
		result += (this._map[x][y] == 1 ? 1 : 0);
	}
	
	return result;
}

ROT.Map.DrunkardWalk = function(width, height, options) {
	ROT.Map.call(this, width, height);
	this._options = {
		bias: {
         N: 40,
         E: 25,
         W: 25,
         S: 10
      }
	};
	for (var p in options) { this._options[p] = options[p]; }
	
}
ROT.Map.DrunkardWalk.extend(ROT.Map);

ROT.Map.DrunkardWalk.prototype.set = function(x, y, value) {
	this._map[x][y] = value;
}

ROT.Map.DrunkardWalk.prototype._nextIndex = function(currIndex, lastIndex){
   var rng = ROT.RNG.getPercentage()
   var bias = this._options.bias
   if(rng < bias['N'] && currIndex['row'] < this._height-1 
        && lastIndex['row'] !== currIndex['row']+1){
      currIndex['row']++
      return currIndex
   }
   rng -= bias['N']
   if(rng < bias['E'] && currIndex['col'] < this._width-1
        && lastIndex['col'] !== currIndex['col']+1){
      currIndex['col']++
      return currIndex
   }
   rng -= bias['E']
   if(rng < bias['W'] && currIndex['col'] > 0
        && lastIndex['col'] !== currIndex['col']-1){
      currIndex['col']--
      return currIndex
   }
   if(currIndex['row'] > 0) currIndex['row']--
   return currIndex
}

ROT.Map.DrunkardWalk.prototype.finished = function(currIndex){
   return currIndex['row'] === this._height-1
}

ROT.Map.DrunkardWalk.prototype.create = function(callback) {
   var tmpIndex
	this._map = this._fillMap(1);
   var index = {
      row: 0,
      col: Math.floor(ROT.RNG.getUniform()*this._width)
   }
   var lastIndex = {
      row:-1,
      col:-1
   }

   this._map[index.col][index.row] = 2
   while(!this.finished(index)){
      tmpIndex = this._nextIndex(index, lastIndex)
      lastIndex = index
      index = tmpIndex
      this._map[index.col][index.row] = 2
      if(callback) callback(index)
   }
   // displayMap(this._map.transpose())
   return this._map
}

function floodFill(map, x, y, target, replacement, maxX, maxY){
   if(
       map[x][y] !== target ||
       x < 0 || y < 0 ||
       x > maxX || y > maxY
     )
   {
      return
   }
   map[x][y] = replacement
   floodFill(map, x-1, y, target, replacement, maxX, maxY)
   floodFill(map, x+1, y, target, replacement, maxX, maxY)
   floodFill(map, x, y-1, target, replacement, maxX, maxY)
   floodFill(map, x, y+1, target, replacement, maxX, maxY)
   return
}

function findMapTile(map,target){
   var counter = 10000
   while(counter--){
      var x = Math.floor(ROT.RNG.getUniform()*map.length)+1
      var y = Math.floor(ROT.RNG.getUniform()*map[0].length)+1
      if(map[x][y] === target){
         return {
            x: x,
            y: y
         }
      }
   }
   return null
}

function findOpenSpace(map, side){
   var target = findMapTile(map, 1)
   console.log(target)
   floodFill(map, target.x, target.y, 1, 0, target.x+side, target.y+side)
}
      
var walktest = new ROT.Map.DrunkardWalk(10,10)
var map = walktest.create()
findOpenSpace(map, 2)
console.log(map)
