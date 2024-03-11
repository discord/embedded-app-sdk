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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
dotenv_1.default.config({ path: '../../.env' });
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
app.use(express_1.default.json());
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
    app.use(express_1.default.static(clientBuildPath));
}
// Fetch token from developer portal and return to the embedded app
app.post('/api/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, utils_1.fetchAndRetry)(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.VITE_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: req.body.code,
        }),
    });
    const { access_token } = (yield response.json());
    res.send({ access_token });
}));
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is listening on port ${port} !`);
});
