export type Question = {
  key: string;
  question: string;
  options: string[];
};

export type IdentificationResult = {
  species: string | null;
  explanation: string;
  candidates: string[];
};

export type Species = {
  id?: string;
  name: string;
  leaf_shape?: string;
  bark_texture?: string;
  fruit_type?: string;
  growth_habit?: string;
  image_url?: string;
};

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`/api/questions`);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function identifyTree(answers: Record<string, string>): Promise<IdentificationResult> {
  const res = await fetch(`/api/identify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error('Failed to identify tree');
  return res.json();
}

export async function getSpeciesList(): Promise<Species[]> {
  const res = await fetch(`/api/species`);
  if (!res.ok) throw new Error('Failed to fetch species');
  return res.json();
}

export async function getSpecies(id: string): Promise<Species> {
  const res = await fetch(`/api/species/${id}`);
  if (!res.ok) throw new Error('Failed to fetch species');
  return res.json();
}

export async function createSpecies(data: Species): Promise<Species> {
  const res = await fetch(`/api/species`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create species');
  return res.json();
}

export async function updateSpecies(id: string, data: Species): Promise<Species> {
  const res = await fetch(`/api/species/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update species');
  return res.json();
}

export async function deleteSpecies(id: string): Promise<void> {
  const res = await fetch(`/api/species/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete species');
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`/api/upload-image`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function classifyImage(imageUrl: string): Promise<any> {
  const res = await fetch(`/api/classify-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) throw new Error('Failed to classify image');
  return res.json();
} 