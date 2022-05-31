import express from 'express';
import axios from 'axios';
import qs from 'qs';
import { Request, Response } from 'express';
const router = express.Router();

export default router.get('/getAccessToken', async(req: Request, res: Response): Promise<void> => {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;
    let returnParams = new URLSearchParams({});
    
    if(!state || state !== storedState){
      returnParams.append('error', 'state_mismatch');
      res.redirect(`${process.env.APP_REDIRECT_URL}?${returnParams.toString()}`)
    }

    try {
      const tokens = await axios.post(
        'https://accounts.spotify.com/api/token', 
        qs.stringify({ 
          grant_type: 'authorization_code',
          redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
          code: code,
          json: true,
        }), 
        { 
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      for(const key in tokens.data) {
        returnParams.append(key, tokens.data[key])
      }
    }
    catch(err: any) {
      console.log('Error in getAccessToken', err);
      returnParams.append('error', 'Something_went_wrong.')
    }

    res.redirect(`${process.env.APP_REDIRECT_URL}?${returnParams.toString()}`);
});