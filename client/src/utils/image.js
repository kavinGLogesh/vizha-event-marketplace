const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/400x250/f5e8e8/7a1c2e?text=No+Image';

/**
 * Resolves an image URL to ensure it points to the correct backend host or Cloudinary.
 * Swaps localhost with the correct production URL if deployed, and handles relative paths.
 * 
 * @param {string} url - The stored image URL
 * @param {string} [fallback] - Optional custom placeholder fallback URL
 * @returns {string} The fully resolved URL
 */
export const getImageUrl = (url, fallback = DEFAULT_PLACEHOLDER) => {
  if (!url) return fallback;

  // 1. If it's already a full external URL (like Cloudinary), use it as is
  if ((url.startsWith('http://') || url.startsWith('https://')) && !url.includes('localhost:8000')) {
    return url;
  }

  // Determine the correct backend API URL based on where the app is running
  let baseUrl = import.meta.env.VITE_API_URL || '';
  
  // Auto-fallback: If we are in production (not localhost) but baseUrl is localhost or empty,
  // we force the Render URL as the fallback.
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocalhost) {
    if (!baseUrl || baseUrl.includes('localhost')) {
      baseUrl = 'https://vizhaeventmarketplaceback.onrender.com';
    }
  }

  // If we still don't have a base URL, fallback to local default
  if (!baseUrl) {
    baseUrl = 'http://localhost:8000';
  }

  const cleanBase = baseUrl.replace(/\/$/, '');

  // 2. If it's a localhost URL, extract the path and prepend the current backend API URL
  if (url.includes('localhost:8000')) {
    const path = url.split('localhost:8000')[1]; // returns something like "/uploads/filename.jpg"
    return `${cleanBase}${path}`;
  }

  // 3. If it's a relative path (e.g. /uploads/filename.jpg or uploads/filename.jpg)
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
  }

  return url;
};
