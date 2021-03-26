import {environment} from '../../environments/environment';

export function buildUrl(endpoint, id?: string) {
  return environment.api_version + '/' + endpoint;
}
