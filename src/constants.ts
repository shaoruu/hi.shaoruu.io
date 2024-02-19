export const youtubeLink = 'https://www.youtube.com/@shaoruu/featured';
export const githubLink = 'https://www.github.com/shaoruu';
export const linkedInLink = 'https://www.linkedin.com/in/shaoruu/';
export const twitterLink = 'https://www.twitter.com/shaoruu';
export const mailLink = 'mailto:ian1314159@gmail.com';
export const buyMeACoffeeLink = 'https://www.buymeacoffee.com/shaoruu';

export const voxelizeWorldLocalStorageKey = 'voxelize-world-name';
const potentialWorldName =
  new URLSearchParams(window.location.search).get('world') ??
  localStorage.getItem(voxelizeWorldLocalStorageKey) ??
  'main';
export const knownWorlds = ['main', 'flat', 'terrain'];
export const currentWorldName = knownWorlds.includes(potentialWorldName)
  ? potentialWorldName
  : knownWorlds[0];
