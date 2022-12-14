export const environment = {
  production: false,
  apiEndpoint: 'https://tekvlicenseserverpocfunction.azurewebsites.net/v1.0',

  // Azure Active Directory Application details
  AUTHORITY:"https://login.microsoftonline.com/e3a46007-31cb-4529-b8cc-1e59b97ebdbd",
  UI_CLIENT_ID:"e643fc9d-b127-4883-8b80-2927df90e275",
  API_CLIENT_ID: 'abb49487-0434-4a82-85fa-b9be4443d158',
  API_SCOPE: 'tekvizion.access',
  
  // BASE URL
  REDIRECT_URL_AFTER_LOGIN:'http://localhost/login',
  REDIRECT_URL_APP: window.location.origin +'/msal-back-to-login',
};
