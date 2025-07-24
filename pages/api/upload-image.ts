import { v2 as cloudinary } from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextApiRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    import('formidable').then(({ IncomingForm }) => {
      const form = new IncomingForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { files } = await parseForm(req);
    let file = files.file;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (Array.isArray(file)) file = file[0];
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await cloudinary.uploader.upload((file as any).filepath, {
      folder: 'plant-identification',
    });
    return res.status(200).json({ url: result.secure_url, public_id: result.public_id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Image upload failed' });
  }
} 