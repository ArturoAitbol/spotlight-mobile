// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:7071/v1.0',

  // Azure Active Directory Application details
  AUTHORITY:"https://login.microsoftonline.com/e3a46007-31cb-4529-b8cc-1e59b97ebdbd",
  UI_CLIENT_ID:"e643fc9d-b127-4883-8b80-2927df90e275",
  API_CLIENT_ID: 'abb49487-0434-4a82-85fa-b9be4443d158',
  API_SCOPE: 'tekvizion.access',
  
  // BASE URL
  REDIRECT_URL_AFTER_LOGIN:'http://localhost:8100/login',
  REDIRECT_URL_APP: window.location.origin +'/msal-back-to-login'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
