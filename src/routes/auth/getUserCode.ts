import express from 'express';
import { generateRandomString } from '../../utils.js'
const router = express.Router();

export default router.get('/getUserCode', (req: any, res: any) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email streaming playlist-read-private playlist-read-collaborative user-read-recently-played user-modify-playback-state';
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        scope: scope,
        redirect_uri: 'http://localhost:8888/auth/getAccessToken',
        state: state
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryString.toString()}`);
});