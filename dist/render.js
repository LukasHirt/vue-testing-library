"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanup = cleanup;
exports.render = render;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _testUtils = require("@vue/test-utils");

var _dom = require("@testing-library/dom");

var _excluded = ["store", "routes", "container", "baseElement"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var mountedWrappers = new Set();

function render(Component) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? null : _ref$store,
      _ref$routes = _ref.routes,
      routes = _ref$routes === void 0 ? null : _ref$routes,
      customContainer = _ref.container,
      customBaseElement = _ref.baseElement,
      mountOptions = (0, _objectWithoutProperties2["default"])(_ref, _excluded);

  var configurationCb = arguments.length > 2 ? arguments[2] : undefined;
  var div = document.createElement('div');
  var baseElement = customBaseElement || customContainer || document.body;
  var container = customContainer || baseElement.appendChild(div);
  var attachTo = document.createElement('div');
  container.appendChild(attachTo);
  var localVue = (0, _testUtils.createLocalVue)();
  var vuexStore = null;
  var router = null;
  var callbackOptions = {};

  if (store) {
    var Vuex = require('vuex');

    localVue.use(Vuex);
    vuexStore = store instanceof Vuex.Store ? store : new Vuex.Store(store);
  }

  if (routes) {
    var requiredRouter = require('vue-router');

    var VueRouter = requiredRouter["default"] || requiredRouter;
    localVue.use(VueRouter);
    router = routes instanceof VueRouter ? routes : new VueRouter({
      routes: routes
    });
  }

  if (configurationCb && typeof configurationCb === 'function') {
    callbackOptions = configurationCb(localVue, vuexStore, router);
  }

  if (!mountOptions.propsData && !!mountOptions.props) {
    mountOptions.propsData = mountOptions.props;
    delete mountOptions.props;
  }

  var wrapper = (0, _testUtils.mount)(Component, _objectSpread(_objectSpread({
    attachTo: attachTo,
    localVue: localVue,
    router: router,
    store: vuexStore
  }, mountOptions), callbackOptions));

  if (Component.fetch) {
    Component.fetch.call(wrapper.vm);
  }

  mountedWrappers.add(wrapper);
  container.appendChild(wrapper.element);
  return _objectSpread({
    container: container,
    baseElement: baseElement,
    debug: function debug() {
      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : baseElement;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return Array.isArray(el) ? el.forEach(function (e) {
        return console.log(_dom.prettyDOM.apply(void 0, [e].concat(args)));
      }) : console.log(_dom.prettyDOM.apply(void 0, [el].concat(args)));
    },
    unmount: function unmount() {
      return wrapper.destroy();
    },
    isUnmounted: function isUnmounted() {
      return wrapper.vm._isDestroyed;
    },
    html: function html() {
      return wrapper.html();
    },
    emitted: function emitted() {
      return wrapper.emitted();
    },
    updateProps: function updateProps(_) {
      return wrapper.setProps(_);
    }
  }, (0, _dom.getQueriesForElement)(baseElement));
}

function cleanup() {
  mountedWrappers.forEach(cleanupAtWrapper);
}

function cleanupAtWrapper(wrapper) {
  if (wrapper.element.parentNode && wrapper.element.parentNode.parentNode === document.body) {
    document.body.removeChild(wrapper.element.parentNode);
  }

  try {
    wrapper.destroy();
  } finally {
    mountedWrappers["delete"](wrapper);
  }
}