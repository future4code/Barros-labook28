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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
/**************************** CONFIG ******************************/
dotenv_1.default.config();
exports.connection = (0, knex_1.default)({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: 3306,
        multipleStatements: true
    }
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var POST_TYPES;
(function (POST_TYPES) {
    POST_TYPES["NORMAL"] = "normal";
    POST_TYPES["EVENT"] = "event";
})(POST_TYPES || (POST_TYPES = {}));
/**************************** ENDPOINTS ******************************/
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let message = "Success!";
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.statusCode = 406;
            message = '"name", "email" and "password" must be provided';
            throw new Error(message);
        }
        const id = Date.now().toString();
        yield (0, exports.connection)('labook_users')
            .insert({
            id,
            name,
            email,
            password
        });
        res.status(201).send({ message });
    }
    catch (error) {
        res.statusCode = 400;
        let message = error.sqlMessage || error.message;
        res.send({ message });
    }
}));
app.post('/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let message = "Success!";
        const { photo, description, type, authorId } = req.body;
        const postId = Date.now().toString();
        yield (0, exports.connection)("labook_posts")
            .insert({
            id: postId,
            photo,
            description,
            type,
            author_id: authorId
        });
        res.status(201).send({ message });
    }
    catch (error) {
        let message = error.sqlMessage || error.message;
        res.statusCode = 400;
        res.send({ message });
    }
}));
app.get('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let message = "Success!";
        const { id } = req.params;
        const queryResult = yield (0, exports.connection)("labook_posts")
            .select("*")
            .where({ id });
        if (!queryResult[0]) {
            res.statusCode = 404;
            message = "Post not found";
            throw new Error(message);
        }
        const post = {
            id: queryResult[0].id,
            photo: queryResult[0].photo,
            description: queryResult[0].description,
            type: queryResult[0].type,
            createdAt: queryResult[0].created_at,
            authorId: queryResult[0].author_id,
        };
        res.status(200).send({ message, post });
    }
    catch (error) {
        let message = error.sqlMessage || error.message;
        res.statusCode = 400;
        res.send({ message });
    }
}));
/**************************** SERVER INIT ******************************/
app.listen(3003, () => {
    console.log("Server running on port 3003");
});
