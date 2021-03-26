// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gms_api_server: 'https://dev-gms.api.easygolf.vn',
  gms_api_inventory: 'https://dev-inventory.api.easygolf.vn',
  gms_websocket_server: 'wss://dev-inventory.api.easygolf.vn/websocket',
  api_version: '1.0',
  version: '1.3.7',
  secured_cookie: false,
  main_domain: 'localhost'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
