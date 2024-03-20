require('dotenv-defaults').config({
  path: `${__dirname}/../.env`,
});

import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import fetch from 'node-fetch';
import { OpenAI } from 'openai';

import { buildContributionBlocks } from '@/server/github';
import { transport } from '@/server/transport';
import { getCoreUrl } from '@/server/urls';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = express();

if (process.env.NODE_ENV === 'development') {
  server.use(cors({ origin: '*' }));
} else {
  server.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'https://hi.shaoruu.io',
          'https://localhost:3001',
        ]; // Add more origins as needed
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('CORS policy violation'));
        }
      },
    }),
  );
}

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get('/voxelize', async (req, res) => {
  const { prompt, secretKey } = req.query as {
    prompt: string;
    secretKey: string;
  };
  if (secretKey !== process.env.SECRET_ADMIN_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const result = await openai.images.generate({
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
    model: 'dall-e-3',
  });
  res.json({ result: result.data });
});

server.get('/contributions', async (req, res) => {
  await buildContributionBlocks();
  res.json({ result: 'done' });
});

server.get('/top-stars', async (req, res) => {
  const user = 'shaoruu';

  let page = 1;
  let allRepos: any[] = [];

  console.log('Fetching repositories...');

  while (true) {
    const response = await fetch(`https://api.github.com/graphql`, {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
            user(login: "${user}") {
              repositories(first: 100, after: "${page * 100}") {
                nodes {
                  name
                  stargazers {
                    totalCount
                  }
                }
              }
            }
          }`,
      }),
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();

    // Break the loop if the page has no repositories
    if (data.length === 0) break;

    allRepos = allRepos.concat(data);
    page++;
  }

  // Sort and pick the top 10
  const topStars = allRepos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);

  console.log('Done fetching repositories.');

  res.json({ result: topStars });
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

  server
    .listen(port, () => console.log(`Server started on port ${port}`))
    .on('error', console.error);
}

startServer();
