import { IS_PRODUCTION } from '@/src/utils/secrets';

export function getCoreUrl() {
  return IS_PRODUCTION ? 'https://hi.shaoruu.io' : 'http://127.0.0.1:4000';
}

export function getServerUrl() {
  return IS_PRODUCTION ? 'https://server.shaoruu.io' : 'http://localhost:8080';
}
