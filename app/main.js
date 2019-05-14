/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/avo/action-pane/index.js":
/*!**************************************!*\
  !*** ./src/avo/action-pane/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar ActionPane =\n/*#__PURE__*/\nfunction () {\n  function ActionPane(app) {\n    _classCallCheck(this, ActionPane);\n\n    this.app = app;\n    this.html = document.getElementById('action-pane');\n    this.html.onkeydown = this.onKeyDown.bind(this);\n    this.html.onkeyup = this.onKeyUp.bind(this);\n  }\n\n  _createClass(ActionPane, [{\n    key: \"focus\",\n    value: function focus() {\n      this.html.focus();\n    }\n  }, {\n    key: \"onKeyDown\",\n    value: function onKeyDown(e) {\n      console.log(e);\n    }\n  }, {\n    key: \"onKeyUp\",\n    value: function onKeyUp(e) {}\n  }]);\n\n  return ActionPane;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActionPane);\n\n//# sourceURL=webpack:///./src/avo/action-pane/index.js?");

/***/ }),

/***/ "./src/avo/constants.js":
/*!******************************!*\
  !*** ./src/avo/constants.js ***!
  \******************************/
/*! exports provided: FRAMES_PER_SECOND, MODES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FRAMES_PER_SECOND\", function() { return FRAMES_PER_SECOND; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MODES\", function() { return MODES; });\nvar FRAMES_PER_SECOND = 20;\nvar MODES = {\n  INITIALISING: 'initialising',\n  ACTION: 'action',\n  CYOA: 'choose your own adventure'\n};\n\n\n//# sourceURL=webpack:///./src/avo/constants.js?");

/***/ }),

/***/ "./src/avo/index.js":
/*!**************************!*\
  !*** ./src/avo/index.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _action_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action-pane */ \"./src/avo/action-pane/index.js\");\n/* harmony import */ var _story__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./story */ \"./src/avo/story.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./src/avo/constants.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nvar AvoAdventure =\n/*#__PURE__*/\nfunction () {\n  function AvoAdventure(story) {\n    _classCallCheck(this, AvoAdventure);\n\n    this.mode = _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].INITIALISING;\n    this.state = '';\n    this.actors = {};\n    this.assets = {};\n    this.actionPane = new _action_pane__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this);\n    this.input = {\n      keysPressed: {}\n    }; // Initialise the story\n\n    this.story = story || new _story__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this);\n    this.nextPlay = null;\n    this.play();\n  }\n\n  _createClass(AvoAdventure, [{\n    key: \"play\",\n    value: function play() {\n      var story = this.story;\n      story.prePlay();\n\n      if (!story.skipPlay()) {// ...\n      }\n\n      story.postPlay(); // Play and Paint are tied. \n\n      this.paint(); // Next step\n\n      this.nextPlay = setTimeout(this.play.bind(this), 1000 / _constants__WEBPACK_IMPORTED_MODULE_2__[\"FRAMES_PER_SECOND\"]);\n    }\n  }, {\n    key: \"paint\",\n    value: function paint() {\n      var story = this.story;\n\n      if (this.mode === _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].ACTION) {\n        story.prePaint();\n\n        if (!story.skipPaint()) {// ...\n        }\n\n        story.postPaint();\n      }\n    }\n  }]);\n\n  return AvoAdventure;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (AvoAdventure);\n\n//# sourceURL=webpack:///./src/avo/index.js?");

/***/ }),

/***/ "./src/avo/story.js":
/*!**************************!*\
  !*** ./src/avo/story.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Story =\n/*#__PURE__*/\nfunction () {\n  function Story(app) {//app.addActor();\n    //app.addActor();\n    //app.addAsset();\n\n    _classCallCheck(this, Story);\n  }\n\n  _createClass(Story, [{\n    key: \"start\",\n    value: function start(app) {//app.\n    }\n  }, {\n    key: \"prePlay\",\n    value: function prePlay(app) {}\n  }, {\n    key: \"skipPlay\",\n    value: function skipPlay() {\n      return false;\n    }\n  }, {\n    key: \"postPlay\",\n    value: function postPlay(app) {}\n  }, {\n    key: \"prePaint\",\n    value: function prePaint(app) {}\n  }, {\n    key: \"skipPaint\",\n    value: function skipPaint() {\n      return false;\n    }\n  }, {\n    key: \"postPaint\",\n    value: function postPaint(app) {}\n  }]);\n\n  return Story;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Story);\n\n//# sourceURL=webpack:///./src/avo/story.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _avo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./avo */ \"./src/avo/index.js\");\n\n\nwindow.onload = function () {\n  window.app = new _avo__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n};\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });