"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./index"));
const PORT = 8000;
const server = http_1.default.createServer(index_1.default);
server.listen(PORT, () => {
    const infos = [
        `at ${new Date().toLocaleString()}`,
        `listening on ${JSON.stringify(server.address())}`
    ];
    console.info('[README.md]', `Run! ${infos.join(', ')}.`);
});
//# sourceMappingURL=server.js.map