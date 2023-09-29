import fetch from 'node-fetch';

import { transport } from '@/server/transport';

export async function getGithubContributions() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Authorization: `bearer ${token}`,
  };

  const body = {
    query: `query {
            user(login: "shaoruu") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      weekday
                    }
                  }
                }
              }
            }
          }`,
  };

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  });

  const data = await response.json();

  return data.data.user.contributionsCollection.contributionCalendar;
}

export async function buildContributionBlocks() {
  const data = await getGithubContributions();
  const colors = data.colors;
  const getContributionLevel = (color: string) => {
    const index = colors.indexOf(color);
    return index < 0 ? 0 : index + 1;
  };
  const weeksData = data.weeks.splice(data.weeks.length - 53, 53);
  const updates: any[] = [];
  let column = 0;
  for (const weekData of weeksData) {
    const { contributionDays } = weekData;

    let row = 47;

    for (const contributionDay of contributionDays) {
      const { color } = contributionDay;
      const contributionLevel = getContributionLevel(color);
      updates.push({
        voxel: 3000 + contributionLevel,
        vx: column + 26,
        vy: row,
        vz: 68,
      });

      row--;
    }

    column--;
  }

  transport.send({
    type: 'UPDATE',
    text: 'main',
    updates,
  });

  console.log(`Updating ${updates.length} blocks for Github contributions`);
}
