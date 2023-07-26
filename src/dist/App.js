"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./styles/global.css");
function App() {
    return (react_1["default"].createElement("main", { className: "min-h-screen bg-zinc-50 flex items-center justify-center" },
        react_1["default"].createElement("form", { className: "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" },
            react_1["default"].createElement("div", { className: "mb-4" },
                react_1["default"].createElement("label", { htmlFor: "email", className: "block text-gray-700 text-sm font-bold mb-2" }, "E-mail"),
                react_1["default"].createElement("input", { type: "email", name: "email", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" })),
            react_1["default"].createElement("div", { className: "mb-4" },
                react_1["default"].createElement("label", { htmlFor: "password", className: "block text-gray-700 text-sm font-bold mb-2" }, "Senha"),
                react_1["default"].createElement("input", { type: "password", name: "password", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" })),
            react_1["default"].createElement("div", { className: "flex items-center justify-center" },
                react_1["default"].createElement("button", { type: "submit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" }, "Salvar")))));
}
exports["default"] = App;
