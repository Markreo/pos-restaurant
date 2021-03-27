import {environment} from '../../environments/environment';

export function buildUrl(endpoint, id?: string) {
  return environment.gms_api_server + '/' + environment.api_version + '/' + endpoint;
}
