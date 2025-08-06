import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'PlantNet API key is not set in environment variables.' });
  }

  try {
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // 👇 Construct a proper GET URL with query parameters
    const params = new URLSearchParams({
      'images': image_url,
      'organs': 'leaf', // or allow frontend to specify
      'api-key': apiKey,
    });

    const url = `https://my-api.plantnet.org/v2/identify/all?${params.toString()}`;

    console.log('PlantNet request (GET):', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`PlantNet API error: ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data); // <-- Return the full response!
  } catch (error) {
    console.error('PlantNet API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'PlantNet API error';
    res.status(500).json({ error: errorMessage });
  }
}
