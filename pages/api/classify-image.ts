import type { NextApiRequest, NextApiResponse } from 'next';

interface PlantNetResponse {
  results: Array<{
    score: number;
    species: {
      scientificNameWithoutAuthor: string;
      scientificNameAuthorship: string;
      scientificName: string;
      genus: {
        scientificNameWithoutAuthor: string;
        scientificNameAuthorship: string;
        scientificName: string;
      };
      family: {
        scientificNameWithoutAuthor: string;
        scientificNameAuthorship: string;
        scientificName: string;
      };
      commonNames: string[];
      synonyms: string[];
      vernacularNames: string[];
      images: Array<{
        url: {
          o: string;
          m: string;
          s: string;
        };
        organ: string;
      }>;
    };
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'PlantNet API key is not set in environment variables.' });
  }

  try {
    const imageToSend = "https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg";

    // 👇 Construct a proper GET URL with query parameters
    const params = new URLSearchParams({
      'images': imageToSend,
      'organs': 'leaf',
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
      throw new Error(`PlantNet API error: ${errorText}`);
    }

    const data: PlantNetResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'No species found' });
    }

    const topResult = data.results[0];
    const species = topResult.species;

    const result = {
      scientific_name: species.scientificNameWithoutAuthor,
      confidence: topResult.score,
      common_names: species.commonNames || [],
      family: species.family.scientificNameWithoutAuthor,
      genus: species.genus.scientificNameWithoutAuthor,
      synonyms: species.synonyms || [],
      vernacular_names: species.vernacularNames || [],
      reference_images: species.images || []
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('PlantNet API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'PlantNet API error';
    res.status(500).json({ error: errorMessage });
  }
}
