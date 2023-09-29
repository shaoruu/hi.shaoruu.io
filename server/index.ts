require('dotenv-defaults').config({
  path: `${__dirname}/../.env`,
});

import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import { OpenAI } from 'openai';

import { buildContributionBlocks } from '@/server/github';
import { transport } from '@/server/transport';
import { getCoreUrl } from '@/server/urls';

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
    response_format: 'b64_json',
  });
  res.json({ result: result.data });
});

const port = process.env.PORT || 8080;

function startCronJobs() {
  cron.schedule('0 0 * * *', async () => {
    await buildContributionBlocks();
  });
}

async function startServer() {
  const coreUrl = getCoreUrl().replace(/http/, 'ws');
  await transport.connect(coreUrl, 'test');

  startCronJobs();
  await buildContributionBlocks();

  server
    .listen(port, () => console.log(`Server started on port ${port}`))
    .on('error', console.error);
}

startServer();
