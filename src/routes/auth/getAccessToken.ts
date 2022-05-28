import express from 'express';
const router = express.Router();
import axios from 'axios';
import qs from 'qs';

export default router.get('/getAccessToken', async(req: any, res: any) => {
    const code = req.query.code;
    const state = req.query.state;
    let returnParams = new URLSearchParams({});
    
    if(!state || !code) returnParams.append('error', 'state_mismatch');

    try {
      const data = { 
        grant_type: 'client_credentials', 
        code: code 
      };

      const tokens = await axios.post(
        'https://accounts.spotify.com/api/token', 
        qs.stringify(data), 
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

    res.redirect(`${process.env.REDIRECT_URL}?${returnParams.toString()}`);
});