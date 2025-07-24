import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongoose';
import Species from '../../../models/Species';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const species = await Species.findById(id);
      if (!species) return res.status(404).json({ error: 'Species not found' });
      res.status(200).json(species);
    } catch {
      res.status(500).json({ error: 'Failed to fetch species' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = await Species.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Species not found' });
      res.status(200).json(updated);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update species';
      res.status(400).json({ error: errorMessage });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = await Species.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Species not found' });
      res.status(200).json({ message: 'Species deleted' });
    } catch {
      res.status(500).json({ error: 'Failed to delete species' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 