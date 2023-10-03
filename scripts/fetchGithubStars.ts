import fs from 'fs';

import fetch from 'node-fetch';

require('dotenv-defaults').config({
  path: `${__dirname}/../.env`,
});

async function start() {
  console.log('Fetching repositories...');

  let allRepos: any[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(
      `https://api.github.com/users/shaoruu/repos?page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    );
    const repos = await response.json();
    allRepos = allRepos.concat(repos);
    hasNextPage = repos.length === 30;
    page++;
  }

  // Sort and pick the top 10
  const topStars = allRepos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      url: repo.html_url,
    }));

  console.log('Done fetching repositories, total: ', allRepos.length);

  const assetPath = `${__dirname}/../src/assets/data/topStars.json`;

  // Write the file
  fs.writeFileSync(assetPath, JSON.stringify(topStars));
}

start();
