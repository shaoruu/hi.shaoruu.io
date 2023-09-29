import { IS_PRODUCTION } from '@/src/utils/secrets';

export function getCoreUrl() {
  return IS_PRODUCTION ? 'https://shaoruu.io' : 'http://localhost:4000';
}

export function getServerUrl() {
  return IS_PRODUCTION ? 'https://server.shaoruu.io' : 'http://localhost:8080';
}
