"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
class ConsoleLogger {
    info(message) {
        console.log(`[INFO] ${message}`);
    }
    error(message) {
        console.error(`[ERROR] ${message}`);
    }
}
exports.ConsoleLogger = ConsoleLogger;
