import express from 'express';
import { generateRandomString } from '../../utils.js'
import { Response, Request } from 'express';

const router = express.Router();

export default router.get('/getUserCode', (req: Request, res: Response): void => {
    const state = generateRandomString(16);
    const scope = 'user-read-email user-read-private user-modify-playback-state user-read-recently-played user-read-playback-position playlist-read-collaborative user-read-currently-playing playlist-read-private';
    res.cookie('spotify_auth_state', state);

    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
        state: state
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryString.toString()}`);
});