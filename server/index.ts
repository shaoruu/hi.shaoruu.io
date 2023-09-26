require('dotenv-defaults').config({
  path: `${__dirname}/../.env`,
});

import path from 'path';

import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';
import { OpenAI } from 'openai';

const worldDataWatcher = chokidar.watch(
  path.resolve(__dirname, '..', 'core', 'data'),
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = express();

server.use(cors({ origin: '*', credentials: true }));

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get('/voxelize', async (req, res) => {
  const { prompt } = req.query as { prompt: string };
  console.log(prompt);
  const result = await openai.images.generate({
    prompt,
    n: 1,
    size: '512x512',
  });
  res.json({ result: result.data });
});

const port = process.env.PORT || 8080;

async function startServer() {
  server
    .listen(port, () => console.log(`Server started on port ${port}`))
    .on('error', console.error);
}

startServer();
