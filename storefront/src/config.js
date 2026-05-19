export const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? 'https://freshcart-core.onrender.com'
  : 'http://localhost:5000';

export const ADMIN_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? 'https://freshcart-admin.onrender.com'
  : 'http://localhost:3001';
