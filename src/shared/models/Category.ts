import { Schema, model } from 'mongoose';

const CatagerySchema = new Schema({
  name: { type: String, required: true },
});

const Category = model('Category', CatagerySchema);

export { Category, CatagerySchema };
