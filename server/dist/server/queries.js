"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.saveMessage = exports.getUsers = exports.getMessages = void 0;
const db = require('./db');
function getMessages(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db.query('SELECT * FROM messages WHERE (author = $1) OR (recipient = $1)', [name]);
            return { messages: response.rows };
        }
        catch (error) {
            return { error: { getMessageError: error }, messages: [] };
        }
    });
}
exports.getMessages = getMessages;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db.query('SELECT * FROM users');
            return { users: response.rows };
        }
        catch (error) {
            return { error: { getUsers: error }, users: [] };
        }
    });
}
exports.getUsers = getUsers;
function saveMessage({ author, recipient, timestamp, text, title }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db.query(`
                        INSERT INTO messages (author, recipient, timestamp, title, text)
                        values ($1, $2, $3, $4, $5)
                        RETURNING *`, [author, recipient, timestamp, title, text]);
            return { message: response.rows[0] };
        }
        catch (error) {
            return { error: { saveMessageError: error, message: {} } };
        }
    });
}
exports.saveMessage = saveMessage;
function addUser(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield db.query('INSERT INTO users (name) values ($1) RETURNING *', [name]);
            return { user: response.rows[0] };
        }
        catch (error) {
            return { error: { addUserError: error } };
        }
    });
}
exports.addUser = addUser;
