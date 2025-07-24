import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { image_url } = req.body;
  if (!image_url) return res.status(400).json({ error: 'Missing image_url' });
  const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY;
  const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';
  try {
    const params = new URLSearchParams({
      'api-key': PLANTNET_API_KEY || '',
      images: image_url,
    });
    const resp = await fetch(`${PLANTNET_API_URL}?${params.toString()}`);
    if (!resp.ok) throw new Error('PlantNet API error');
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      const best = data.results[0];
      const species = best.species;
      return res.status(200).json({
        class: species.scientificNameWithoutAuthor,
        confidence: best.score,
        common_names: species.commonNames || [],
        family: species.family?.scientificNameWithoutAuthor,
        genus: species.genus?.scientificNameWithoutAuthor,
        synonyms: species.synonyms || [],
        vernacular_names: species.vernacularNames || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        images: (best.images || []).map((img: any) => img.url),
      });
    } else {
      return res.status(200).json({ class: 'Unknown', confidence: 0.0 });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Image classification failed' });
  }
} 