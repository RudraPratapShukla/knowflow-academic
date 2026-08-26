// Example: Fetching data from Google APIs (e.g., Custom Search, Books, etc.)

export async function fetchGoogleData(endpoint: string, params: Record<string, string>, apiKey: string) {
  const url = new URL(`https://www.googleapis.com/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  url.searchParams.append('key', apiKey);
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch Google API data');
  return response.json();
}

// Example usage:
// fetchGoogleData('books/v1/volumes', { q: 'harry potter' }, 'YOUR_API_KEY').then(console.log);
