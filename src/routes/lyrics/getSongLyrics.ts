import express from 'express';
import { Response, Request } from 'express';
import Genius from "genius-lyrics";
import axios from 'axios';

const router = express.Router();
const lyricClient = new Genius.Client(process.env.GENIUS_LYRICS_ID);

export default router.get('/getSongLyrics', async (req: Request, res: Response): Promise<void> => {
  const songName = req.query.songName.toString();
  const artistName = req.query.artistName.toString();
  let lyrics;

  try {
    const lyricsWithTimestamps = await axios.get(`https://api.textyl.co/api/lyrics?q=${artistName} ${songName}`);
    lyrics = lyricsWithTimestamps.data
  }
  catch(err) {
    console.log('ERROR :: getSongLyrics :: textyl api res', err);
    lyrics = err.response.data
  }

  try {
    const songsList = await lyricClient.songs.search(songName);
    const songFromArtist = songsList.filter((elm) => {
      return elm.artist.name.includes(artistName)
    });

    if(songFromArtist.length >= 1 && lyrics === 'No lyrics available') {
      const fullLyricsString = await songFromArtist[0].lyrics();
      const lyricsArray = fullLyricsString.split('\n');
      
      lyrics = lyricsArray.filter((elm) => {
        return !elm.includes('[')
      })
    }
    else {
      throw new Error('No lyrics available')
    }

    res.send(lyrics)
  }
  catch(err) {
    console.log('ERROR :: getSongLyrics', err);
    res.send({ 'Error': err });
  }
});