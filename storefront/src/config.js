let apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
if (apiHost && !apiHost.startsWith('http://') && !apiHost.startsWith('https://')) {
  apiHost = 'https://' + apiHost;
}
export const API_URL = apiHost;

let adminHost = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';
if (adminHost && !adminHost.startsWith('http://') && !adminHost.startsWith('https://')) {
  adminHost = 'https://' + adminHost;
}
export const ADMIN_URL = adminHost;
