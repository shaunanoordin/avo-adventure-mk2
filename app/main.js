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

/***/ "./src/avo/action-mode/action-mode.js":
/*!********************************************!*\
  !*** ./src/avo/action-mode/action-mode.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar ActionMode =\n/*#__PURE__*/\nfunction () {\n  function ActionMode(app) {\n    _classCallCheck(this, ActionMode);\n\n    this.html = document.getElementById('action-mode');\n    this.width = 320;\n    this.height = 240;\n    this.canvas2d = this.html.getContext(\"2d\"); // Set HTML\n\n    console.log(this.html);\n    this.html.width = this.width;\n    this.html.height = this.height;\n    this.canvasSizeRatio = 1;\n    this.html.onkeydown = this.onKeyDown.bind(this, app);\n    this.html.onkeyup = this.onKeyUp.bind(this, app);\n  }\n\n  _createClass(ActionMode, [{\n    key: \"load\",\n    value: function load(app) {\n      this.focus();\n    }\n  }, {\n    key: \"unload\",\n    value: function unload(app) {}\n  }, {\n    key: \"focus\",\n    value: function focus() {\n      this.html.focus();\n    }\n  }, {\n    key: \"play\",\n    value: function play(app) {}\n  }, {\n    key: \"paint\",\n    value: function paint(app) {\n      var canvas2d = this.canvas2d; // Clear canvas before painting\n\n      canvas2d.clearRect(0, 0, this.width, this.height);\n      Object.keys(app.actors).forEach(function (actorId) {\n        app.actors[actorId].paint(app);\n      }); // const assets = app.assets;\n      // canvas2d.drawImage(assets.basicActor.img, 0, 0, 48, 48, 0, 0, 48, 48);\n    }\n  }, {\n    key: \"focus\",\n    value: function focus() {\n      this.html.focus();\n    }\n  }, {\n    key: \"onKeyDown\",\n    value: function onKeyDown(app, e) {\n      // TEMP: move Player\n      var speed = 1;\n\n      switch (e.key) {\n        case 'ArrowRight':\n          app.playerActor.x += speed;\n          break;\n\n        case 'ArrowDown':\n          app.playerActor.y += speed;\n          break;\n\n        case 'ArrowLeft':\n          app.playerActor.x -= speed;\n          break;\n\n        case 'ArrowUp':\n          app.playerActor.y -= speed;\n          break;\n      }\n    }\n  }, {\n    key: \"onKeyUp\",\n    value: function onKeyUp(app, e) {}\n  }]);\n\n  return ActionMode;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActionMode);\n\n//# sourceURL=webpack:///./src/avo/action-mode/action-mode.js?");

/***/ }),

/***/ "./src/avo/action-mode/index.js":
/*!**************************************!*\
  !*** ./src/avo/action-mode/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _action_mode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action-mode */ \"./src/avo/action-mode/action-mode.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_action_mode__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack:///./src/avo/action-mode/index.js?");

/***/ }),

/***/ "./src/avo/avo-adventure.js":
/*!**********************************!*\
  !*** ./src/avo/avo-adventure.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _action_mode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action-mode */ \"./src/avo/action-mode/index.js\");\n/* harmony import */ var _story__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./story */ \"./src/avo/story.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./src/avo/constants.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nvar AvoAdventure =\n/*#__PURE__*/\nfunction () {\n  function AvoAdventure(story) {\n    _classCallCheck(this, AvoAdventure);\n\n    this.mode = _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].INITIALISING;\n    this.actors = {};\n    this.assets = {};\n    this.playerActor = null;\n    this.actionMode = new _action_mode__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this);\n    this.input = {\n      keysPressed: {}\n    }; // Initialise the story\n\n    this.story = story || new _story__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this);\n    this.nextFrame = null;\n    this.runFrame();\n  }\n\n  _createClass(AvoAdventure, [{\n    key: \"changeMode\",\n    value: function changeMode(newMode) {\n      if (this.mode === _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].ACTION) this.actionMode.unload(this);\n      if (newMode === _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].ACTION) this.actionMode.load(this);\n      this.mode = newMode;\n    }\n    /*  Each frame is a 'step' in the game\r\n     */\n\n  }, {\n    key: \"runFrame\",\n    value: function runFrame() {\n      if (this.mode === _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].INITIALISING) this.startStoryIfReady(); // Run game logic and update game visuals\n      // Note: gameplay and visual frames are tied.\n\n      this.play();\n      this.paint();\n      this.nextFrame = setTimeout(this.runFrame.bind(this), 1000 / _constants__WEBPACK_IMPORTED_MODULE_2__[\"FRAMES_PER_SECOND\"]);\n    }\n    /*  Run game logic\r\n     */\n\n  }, {\n    key: \"play\",\n    value: function play() {\n      var story = this.story;\n\n      if (!story.skipPlay()) {\n        if (this.mode === _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].ACTION) this.actionMode.play(this);\n      }\n\n      story.customPlay(this);\n    }\n    /*  Update game visuals\r\n     */\n\n  }, {\n    key: \"paint\",\n    value: function paint() {\n      var story = this.story;\n\n      if (!story.skipPaint()) {\n        if (this.mode === _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].ACTION) this.actionMode.paint(this);\n      }\n\n      story.customPaint(this);\n    }\n    /*  Check if Story is ready to start\r\n     */\n\n  }, {\n    key: \"startStoryIfReady\",\n    value: function startStoryIfReady() {\n      var _this = this;\n\n      if (this.mode !== _constants__WEBPACK_IMPORTED_MODULE_2__[\"MODES\"].INITIALISING) return; // Assets Check\n\n      var allAssetsLoaded = true;\n      Object.keys(this.assets).forEach(function (key) {\n        var asset = _this.assets[key];\n        allAssetsLoaded = allAssetsLoaded && asset.loaded;\n      });\n\n      if (allAssetsLoaded) {\n        this.story.start(this);\n      }\n    }\n  }]);\n\n  return AvoAdventure;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (AvoAdventure);\n\n//# sourceURL=webpack:///./src/avo/avo-adventure.js?");

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

/***/ "./src/avo/image-asset.js":
/*!********************************!*\
  !*** ./src/avo/image-asset.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction ImageAsset(url) {\n  this.url = url;\n  this.img = null;\n  this.loaded = false;\n  this.img = new Image();\n\n  this.img.onload = function () {\n    this.loaded = true;\n  }.bind(this);\n\n  this.img.src = this.url;\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ImageAsset);\n\n//# sourceURL=webpack:///./src/avo/image-asset.js?");

/***/ }),

/***/ "./src/avo/index.js":
/*!**************************!*\
  !*** ./src/avo/index.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _avo_adventure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./avo-adventure */ \"./src/avo/avo-adventure.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_avo_adventure__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack:///./src/avo/index.js?");

/***/ }),

/***/ "./src/avo/story-elements/actor.js":
/*!*****************************************!*\
  !*** ./src/avo/story-elements/actor.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"./src/avo/constants.js\");\n/* harmony import */ var _story_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./story-element */ \"./src/avo/story-elements/story-element.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar Actor =\n/*#__PURE__*/\nfunction (_StoryElement) {\n  _inherits(Actor, _StoryElement);\n\n  function Actor() {\n    _classCallCheck(this, Actor);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(Actor).call(this));\n  }\n\n  _createClass(Actor, [{\n    key: \"play\",\n    value: function play(app) {}\n  }, {\n    key: \"paint\",\n    value: function paint(app) {\n      var canvas2d = app.actionMode && app.actionMode.canvas2d;\n      if (app.mode !== _constants__WEBPACK_IMPORTED_MODULE_0__[\"MODES\"].ACTION) return;\n      if (!canvas2d) return;\n      var camera = {\n        x: 0,\n        y: 0\n      }; // TEMP\n      // Simple shadow\n\n      canvas2d.fillStyle = 'rgba(0, 0, 0, 0.5)';\n      canvas2d.beginPath();\n      canvas2d.arc(this.x + camera.x, this.y + camera.y, (this.sizeX + this.sizeY) / 4, 0, 2 * Math.PI);\n      canvas2d.fill();\n      canvas2d.closePath();\n    }\n  }]);\n\n  return Actor;\n}(_story_element__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Actor);\n\n//# sourceURL=webpack:///./src/avo/story-elements/actor.js?");

/***/ }),

/***/ "./src/avo/story-elements/story-element.js":
/*!*************************************************!*\
  !*** ./src/avo/story-elements/story-element.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar StoryElement =\n/*#__PURE__*/\nfunction () {\n  function StoryElement() {\n    _classCallCheck(this, StoryElement);\n\n    this.x = 0;\n    this.y = 0;\n    this.sizeX = 48;\n    this.sizeY = 48;\n  }\n\n  _createClass(StoryElement, [{\n    key: \"play\",\n    value: function play(app) {}\n  }, {\n    key: \"paint\",\n    value: function paint(app) {}\n  }]);\n\n  return StoryElement;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (StoryElement);\n\n//# sourceURL=webpack:///./src/avo/story-elements/story-element.js?");

/***/ }),

/***/ "./src/avo/story.js":
/*!**************************!*\
  !*** ./src/avo/story.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/avo/constants.js\");\n/* harmony import */ var _image_asset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image-asset */ \"./src/avo/image-asset.js\");\n/* harmony import */ var _story_elements_actor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./story-elements/actor */ \"./src/avo/story-elements/actor.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nvar Story =\n/*#__PURE__*/\nfunction () {\n  function Story(app) {\n    _classCallCheck(this, Story);\n\n    // Assets\n    app.assets.basicActor = new _image_asset__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('assets/actor-v1.png');\n    app.playerActor = new _story_elements_actor__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\n    app.actors['player'] = app.playerActor; // TODO:\n    // app.addActor();\n    // app.addAsset();\n  }\n\n  _createClass(Story, [{\n    key: \"start\",\n    value: function start(app) {\n      console.info('STORY IS READY TO START!');\n      app.changeMode(_constants__WEBPACK_IMPORTED_MODULE_0__[\"MODES\"].ACTION);\n    }\n  }, {\n    key: \"skipPlay\",\n    value: function skipPlay() {\n      return false;\n    }\n  }, {\n    key: \"customPlay\",\n    value: function customPlay(app) {}\n  }, {\n    key: \"skipPaint\",\n    value: function skipPaint() {\n      return false;\n    }\n  }, {\n    key: \"customPaint\",\n    value: function customPaint(app) {}\n  }]);\n\n  return Story;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Story);\n\n//# sourceURL=webpack:///./src/avo/story.js?");

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