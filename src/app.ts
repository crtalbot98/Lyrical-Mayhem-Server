import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import getUserCode from './routes/auth/getUserCode.js';
import getAccessToken from './routes/auth/getAccessToken.js';
import getSongLyrics from './routes/lyrics/getSongLyrics.js';
import cors from 'cors';

const port = process.env.PORT;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.APP_REDIRECT_URL,
    optionsSuccessStatus: 200
}));

app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/config'));
app.use(cookieParser());

app.use('/auth', getUserCode);
app.use('/auth', getAccessToken);
app.use('/lyrics', getSongLyrics);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
