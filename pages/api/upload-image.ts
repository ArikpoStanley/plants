import { v2 as cloudinary } from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files } from 'formidable';

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

function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { files } = await parseForm(req);
    const file = files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Handle both single file and array of files
    const fileToUpload = Array.isArray(file) ? file[0] : file;
    if (!fileToUpload) return res.status(400).json({ error: 'No file uploaded' });
    
    const result = await cloudinary.uploader.upload(fileToUpload.filepath, {
      folder: 'plant-identification',
    });
    return res.status(200).json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
} 