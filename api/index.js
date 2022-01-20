"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, compression_1.default)());
const templateNames = fs_extra_1.default.readdirSync(path_1.default.resolve(__dirname, '..', 'templates'));
app.get('/', (req, res) => {
    res.send(fs_extra_1.default.readJsonSync(path_1.default.resolve(__dirname, '..', 'package.json')));
});
app.get('/templates', (req, res) => {
    res.send(templateNames);
});
module.exports = app;
//# sourceMappingURL=index.js.map