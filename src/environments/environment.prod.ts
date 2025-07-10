export const environment = {
  production: true,
  apiUrl: import.meta.env?.['VITE_API_URL_PROD'] || 'https://maple-erp-backend.onrender.com'
};