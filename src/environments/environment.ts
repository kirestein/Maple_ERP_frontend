export const environment = {
  production: false,
  apiUrl: import.meta.env?.['VITE_API_URL_DEV'] || 'http://localhost:4000'
};