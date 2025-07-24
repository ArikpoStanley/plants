import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongoose';
import Species from '../../../models/Species';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      const species = await Species.find({}).sort({ name: 1 });
      res.status(200).json(species);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.status(500).json({ error: 'Failed to fetch species' });
    }
  } else if (req.method === 'POST') {
    try {
      const species = await Species.create(req.body);
      res.status(201).json(species);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.status(400).json({ error: (err as any).message || 'Failed to create species' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 