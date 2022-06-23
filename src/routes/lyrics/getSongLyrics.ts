import express from 'express';
import { Response, Request } from 'express';
import Genius from "genius-lyrics";
import axios from 'axios';

interface lyricsWithError {
  data?: {
    seconds?: number;
    lyric: string;
  }[] | string[];
  error?: string
}

const router = express.Router();
const lyricClient = new Genius.Client(process.env.GENIUS_LYRICS_ID);

export default router.get('/getSongLyrics', async (req: Request, res: Response): Promise<void> => {
  const songName = req.query.songName.toString();
  const artistName = req.query.artistName.toString();
  let lyrics = await getTimestampedLyrics(songName, artistName);

  if(!lyrics?.data || lyrics?.error) lyrics = await getLyricsWithoutTimestamps(songName, artistName);
  res.send(lyrics)
});

async function getTimestampedLyrics(songName: string, artistName: string): Promise<lyricsWithError> {
  try {
    const lyricsWithTimestamps = await axios.get(`https://api.textyl.co/api/lyrics?q=${artistName} ${songName}`);

    if(!lyricsWithTimestamps.data[0]?.seconds) throw new Error(lyricsWithTimestamps.data)
    return { data: lyricsWithTimestamps.data }
  }
  catch(err) {
    console.log('ERROR :: getTimestampedLyrics :: textyl api res', err.response.data);
    return { error: err.response.data }
  }
}

async function getLyricsWithoutTimestamps(songName: string, artistName: string): Promise<lyricsWithError> {
  try {
    const songsList = await lyricClient.songs.search(songName);
    const songFromArtist = songsList.filter((elm) => {
      return elm.artist.name.includes(artistName)
    });

    if(songFromArtist.length < 1) throw new Error('No lyrics available');

    const fullLyricsString = await songFromArtist[0].lyrics();
    const lyricsArray = fullLyricsString.split('\n');
    const lyricsWithoutQuotes = lyricsArray.filter((elm) => {
      return !elm.includes('[') || !elm.includes(']')
    });

    return { data: lyricsWithoutQuotes }
  }
  catch(err) {
    console.log('ERROR :: getLyricsWithoutTimestamps :: genius lyrics res', err);
    return { error: err.message }
  }
}