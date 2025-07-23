import mongoose, { Schema, models } from 'mongoose';

const SpeciesSchema = new Schema({
  name: { type: String, required: true, unique: true },
  leaf_shape: String,
  bark_texture: String,
  fruit_type: String,
  growth_habit: String,
  image_url: String,
});

export default models.Species || mongoose.model('Species', SpeciesSchema); 