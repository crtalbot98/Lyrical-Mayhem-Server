import express from 'express';
import { generateRandomString } from '../utils.js';
const router = express.Router();
export default router.get('/', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URL,
        state: state
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryString.toString()}`);
});
//# sourceMappingURL=auth.js.map