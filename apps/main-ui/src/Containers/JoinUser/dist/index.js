"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.JoinUser = void 0;
var react_1 = require("react");
var styled_components_1 = require("styled-components");
var antd_1 = require("antd");
var react_router_dom_1 = require("react-router-dom");
var icons_1 = require("../../assets/icons");
var check_1 = require("@iconify-icons/feather/check");
var react_2 = require("@iconify/react");
var Option = antd_1.Select.Option;
exports.JoinUser = function () {
    return (react_1["default"].createElement(WrapperJoinUser, { className: "flex" },
        react_1["default"].createElement("div", { className: "illustration-area" },
            react_1["default"].createElement(antd_1.Row, { gutter: 24 },
                react_1["default"].createElement(antd_1.Col, { span: 18, offset: 3 },
                    react_1["default"].createElement(icons_1.JoinUserIllustration, null),
                    react_1["default"].createElement("div", { className: "responsibilities mt-20" },
                        react_1["default"].createElement("h2", { className: "title" }, "Wellcome to Organization"),
                        react_1["default"].createElement("h4", { className: "sub-heading" }, "Your Responsibilities"),
                        react_1["default"].createElement("ul", null,
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue."),
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue."),
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue."),
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue."),
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue."),
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue."),
                            react_1["default"].createElement("li", null,
                                react_1["default"].createElement(react_2["default"], { icon: check_1["default"] }),
                                " Consectetur leo risus tellus quis eu augue.")))))),
        react_1["default"].createElement("div", { className: "form-wrapper" },
            react_1["default"].createElement(antd_1.Form, { layout: "vertical" },
                react_1["default"].createElement("h4", { className: "form-heading" }, "Wellcome to Uconnect"),
                react_1["default"].createElement("p", { className: "form-description" }),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Name", name: "name", rules: [{ required: true, message: "Name is required!" }] },
                    react_1["default"].createElement(antd_1.Input, { size: "middle" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "User Name", name: "username", rules: [{ required: true, message: "username is required!" }] },
                    react_1["default"].createElement(antd_1.Input, { size: "middle" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Email", name: "email", rules: [
                        { required: true, message: "email is required!" },
                        { type: "email" },
                    ] },
                    react_1["default"].createElement(antd_1.Input, { size: "middle" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Country", name: "country", rules: [{ required: true, message: "country is required!" }] },
                    react_1["default"].createElement(antd_1.Select, { size: "large", showSearch: true, style: { width: "100%" }, placeholder: "Select a Country", optionFilterProp: "children" },
                        react_1["default"].createElement(Option, { value: "pakistan" }, "Pakistan"),
                        react_1["default"].createElement(Option, { value: "china" }, "China"),
                        react_1["default"].createElement(Option, { value: "america" }, "America"))),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Role", name: "role", rules: [{ required: true, message: "email is required!" }] },
                    react_1["default"].createElement(antd_1.Input, { disabled: true, size: "middle" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Branch", name: "branch", rules: [{ required: true, message: "email is required!" }] },
                    react_1["default"].createElement(antd_1.Input, { disabled: true, size: "middle" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Phone Number", name: "phoneNumber", rules: [{ required: true, message: "email is required!" }] },
                    react_1["default"].createElement(antd_1.Input, { disabled: true, size: "middle" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "Password", name: "password", rules: [{ required: true, message: "password is required!" }] },
                    react_1["default"].createElement(antd_1.Input.Password, { size: "large" })),
                react_1["default"].createElement(antd_1.Form.Item, { name: "agreed", valuePropName: "checked" },
                    react_1["default"].createElement(antd_1.Checkbox, null,
                        react_1["default"].createElement("span", null,
                            "I have read and agree to the ",
                            react_1["default"].createElement(react_router_dom_1.Link, null, "terms, "),
                            react_1["default"].createElement(react_router_dom_1.Link, null, "Privacy, "),
                            " and ",
                            react_1["default"].createElement(react_router_dom_1.Link, null, "offer details ")))),
                react_1["default"].createElement(antd_1.Form.Item, { name: "update-details", valuePropName: "checked" },
                    react_1["default"].createElement(antd_1.Checkbox, null, "Send me all the Marketing and Update details")),
                react_1["default"].createElement(antd_1.Form.Item, null,
                    react_1["default"].createElement(antd_1.Button, { type: "primary", size: "middle" }, "Create a account"))))));
};
var WrapperJoinUser = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: #f8fcff;\n  height: 100vh;\n  .illustration-area {\n    flex: 60%;\n\n    .responsibilities{\n      font-weight: 500;\n    font-size: 54px;\n    line-height: 63px;\n    display: flex;\n    align-items: center;\n\n    color: #000000;\n    }\n  }\n\n  .form-wrapper {\n    flex: 40%;\n    background: #fff;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    .form-heading {\n      font-weight: 600;\n      font-size: 22px;\n      line-height: 30px;\n      /* identical to box height */\n\n      display: flex;\n      align-items: center;\n\n      color: #000000;\n    }\n    .form-description {\n      font-weight: normal;\n      font-size: 16px;\n      line-height: 19px;\n      display: flex;\n      align-items: center;\n      text-align: center;\n      margin: 0;\n      color: #4a4a4a;\n    }\n\n    label::before {\n      display: none !important;\n    }\n  }\n"], ["\n  background: #f8fcff;\n  height: 100vh;\n  .illustration-area {\n    flex: 60%;\n\n    .responsibilities{\n      font-weight: 500;\n    font-size: 54px;\n    line-height: 63px;\n    display: flex;\n    align-items: center;\n\n    color: #000000;\n    }\n  }\n\n  .form-wrapper {\n    flex: 40%;\n    background: #fff;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    .form-heading {\n      font-weight: 600;\n      font-size: 22px;\n      line-height: 30px;\n      /* identical to box height */\n\n      display: flex;\n      align-items: center;\n\n      color: #000000;\n    }\n    .form-description {\n      font-weight: normal;\n      font-size: 16px;\n      line-height: 19px;\n      display: flex;\n      align-items: center;\n      text-align: center;\n      margin: 0;\n      color: #4a4a4a;\n    }\n\n    label::before {\n      display: none !important;\n    }\n  }\n"])));
var templateObject_1;
