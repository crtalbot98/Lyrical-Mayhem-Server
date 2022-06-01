import express from 'express';
import { Response, Request } from 'express';
import Genius from "genius-lyrics";
import axios from 'axios';

const router = express.Router();
const lyricClient = new Genius.Client(process.env.GENIUS_LYRICS_ID);

export default router.get('/getSongLyrics', async (req: Request, res: Response): Promise<void> => {
  const songName = req.query.songName.toString();
  const artistName = req.query.artistName.toString();

  try {
    const songWithTimestampedLyrics = await axios.get(`https://api.textyl.co/api/lyrics?q=${artistName} ${songName}`);
    const songsList = await lyricClient.songs.search(songName);

    const songFromArtist = songsList.filter((elm) => {
      return elm.artist.name.includes(artistName)
    });

    if(songFromArtist.length < 1 && songWithTimestampedLyrics.data === 'No lyrics available') {
      res.send('No lyrics available')
    }

    const lyrics = songWithTimestampedLyrics.data !== 'No lyrics available' ? songWithTimestampedLyrics.data : await songFromArtist[0].lyrics()
    res.send(lyrics);
  }
  catch(err) {
    console.log('ERROR :: getSongLyrics', err);
    res.send('ERROR :: Something went wrong.');
  }
});