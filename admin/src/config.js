let apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
if (apiHost && !apiHost.startsWith('http://') && !apiHost.startsWith('https://')) {
  apiHost = 'https://' + apiHost;
}
export const API_URL = apiHost;
