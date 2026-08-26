// YouTube Data API integration
// Place your YouTube API key in an environment variable or config file for security

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export async function fetchYouTubeVideos(query: string, apiKey: string, maxResults = 5) {
  const url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch YouTube data');
  return response.json();
}

// Example usage:
// import { fetchYouTubeVideos } from './youtube';
// fetchYouTubeVideos('react tutorial', 'YOUR_API_KEY').then(console.log);
