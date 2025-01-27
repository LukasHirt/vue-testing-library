"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fireEvent = fireEvent;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dom = require("@testing-library/dom");

/* eslint-disable testing-library/no-wait-for-empty-callback, testing-library/await-fire-event */
// Vue Testing Lib's version of fireEvent will call DOM Testing Lib's
// version of fireEvent. The reason is because we need to wait another
// event loop tick to allow Vue to flush and update the DOM
// More info: https://vuejs.org/v2/guide/reactivity.html#Async-Update-Queue
function fireEvent() {
  return _fireEvent.apply(this, arguments);
}

function _fireEvent() {
  _fireEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _dom.fireEvent.apply(void 0, _args3);

            _context3.next = 3;
            return (0, _dom.waitFor)(function () {});

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _fireEvent.apply(this, arguments);
}

Object.keys(_dom.fireEvent).forEach(function (key) {
  fireEvent[key] = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            warnOnChangeOrInputEventCalledDirectly(_args.length <= 1 ? undefined : _args[1], key);

            _dom.fireEvent[key].apply(_dom.fireEvent, _args);

            _context.next = 4;
            return (0, _dom.waitFor)(function () {});

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
});

fireEvent.touch = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(elem) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fireEvent.focus(elem);

          case 2:
            _context2.next = 4;
            return fireEvent.blur(elem);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}(); // fireEvent.update is a small utility to provide a better experience when
// working with v-model.
// Related upstream issue: https://github.com/vuejs/vue-test-utils/issues/345#issuecomment-380588199
// Examples: https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/form.js


fireEvent.update = function (elem, value) {
  var tagName = elem.tagName;
  var type = elem.type;

  switch (tagName) {
    case 'OPTION':
      {
        elem.selected = true;
        var parentSelectElement = elem.parentElement.tagName === 'OPTGROUP' ? elem.parentElement.parentElement : elem.parentElement;
        return fireEvent.change(parentSelectElement);
      }

    case 'INPUT':
      {
        if (['checkbox', 'radio'].includes(type)) {
          elem.checked = true;
          return fireEvent.change(elem);
        } else if (type === 'file') {
          return fireEvent.change(elem);
        } else {
          var _elem$_vModifiers;

          elem.value = value;

          if ((_elem$_vModifiers = elem._vModifiers) !== null && _elem$_vModifiers !== void 0 && _elem$_vModifiers.lazy) {
            return fireEvent.change(elem);
          }

          return fireEvent.input(elem);
        }
      }

    case 'TEXTAREA':
      {
        var _elem$_vModifiers2;

        elem.value = value;

        if ((_elem$_vModifiers2 = elem._vModifiers) !== null && _elem$_vModifiers2 !== void 0 && _elem$_vModifiers2.lazy) {
          return fireEvent.change(elem);
        }

        return fireEvent.input(elem);
      }

    case 'SELECT':
      {
        elem.value = value;
        return fireEvent.change(elem);
      }

    default: // do nothing

  }

  return null;
};

function warnOnChangeOrInputEventCalledDirectly(eventValue, eventKey) {
  if (process.env.VTL_SKIP_WARN_EVENT_UPDATE) return;

  if (eventValue && (eventKey === 'change' || eventKey === 'input')) {
    console.warn("Using \"fireEvent.".concat(eventKey, "\" may lead to unexpected results. Please use fireEvent.update() instead."));
  }
}