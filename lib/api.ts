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

export interface Species {
  _id: string;
  name: string;
  leaf_shape?: string;
  bark_texture?: string;
  fruit_type?: string;
  growth_habit?: string;
  image_url?: string;
}

export interface PlantNetResult {
  scientific_name: string;
  confidence: number;
  common_names: string[];
  family: string;
  genus: string;
  synonyms: string[];
  vernacular_names: string[];
  reference_images: Array<{
    url: {
      o: string;
      m: string;
      s: string;
    };
    organ: string;
  }>;
}

export interface PlantNetFullResponse {
  query: {
    project?: string;
    images: string[];
    organs: string[];
  };
  language?: string;
  preferedReferential?: string;
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
  remainingIdentificationRequests?: number;
}

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
  const response = await fetch('/api/species');
  if (!response.ok) {
    throw new Error('Failed to fetch species from backend');
  }
  return response.json();
}

export async function getSpecies(id: string): Promise<Species> {
  const response = await fetch(`/api/species/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch species');
  }
  return response.json();
}

export async function createSpecies(speciesData: Omit<Species, '_id'>): Promise<Species> {
  const response = await fetch('/api/species', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(speciesData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create species');
  }
  return response.json();
}

export async function updateSpecies(id: string, speciesData: Partial<Species>): Promise<Species> {
  const response = await fetch(`/api/species/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(speciesData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update species');
  }
  return response.json();
}

export async function deleteSpecies(id: string): Promise<void> {
  const response = await fetch(`/api/species/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete species');
  }
}

export async function uploadImage(file: File): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}

export async function classifyImage(imageUrl: string): Promise<PlantNetFullResponse> {
  const response = await fetch('/api/classify-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to classify image');
  }

  return response.json();
} 