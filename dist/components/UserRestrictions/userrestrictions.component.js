"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UserRestrictions;

require("core-js/modules/es.string.includes.js");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UserRestrictions(props) {
  const {
    children,
    permittedUsers,
    roleId
  } = props; // const roleId = 1;

  const hasPermissions = permittedUsers && permittedUsers.length && permittedUsers.includes(Number(roleId)) || permittedUsers.length <= 0 || permittedUsers.length > 0 && !roleId;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, hasPermissions && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, children));
}