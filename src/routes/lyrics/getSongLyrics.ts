import express from 'express';
import { Response, Request } from 'express';
import Genius from "genius-lyrics";
import axios from 'axios';

interface lyricsWithError {
  data: {
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

  if(lyrics.data.length < 1 || lyrics.error) lyrics = await getLyricsWithoutTimestamps(songName, artistName);
  if(lyrics.error) res.status(500).send({ error: lyrics.error });
  res.send(lyrics)
});

async function getTimestampedLyrics(songName: string, artistName: string): Promise<lyricsWithError> {
  let lyrics = {} as lyricsWithError;

  try {
    const lyricsWithTimestamps = await axios.get(`https://api.textyl.co/api/lyrics?q=${artistName} ${songName}`);
    lyrics.data = lyricsWithTimestamps.data
  }
  catch(err) {
    console.log('ERROR :: getSongLyrics :: textyl api res', err);
    lyrics.error = err.response.data
  }

  return lyrics
}

async function getLyricsWithoutTimestamps(songName: string, artistName: string): Promise<lyricsWithError> {
  let lyrics = {} as lyricsWithError;

  try {
    const songsList = await lyricClient.songs.search(songName);
    const songFromArtist = songsList.filter((elm) => {
      return elm.artist.name.includes(artistName)
    });

    if(songFromArtist.length >= 1) {
      const fullLyricsString = await songFromArtist[0].lyrics();
      const lyricsArray = fullLyricsString.split('\n');

      lyrics.data = lyricsArray.filter((elm) => {
        return !elm.includes('[') || !elm.includes(']')
      })
    }
    else {
      throw new Error('No lyrics available')
    }
  }
  catch(err) {
    console.log('ERROR :: getSongLyrics', err);
    lyrics.error = err.response.data
  }

  return lyrics
}