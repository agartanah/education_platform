import { Schema, model } from 'mongoose';

const CatagerySchema = new Schema({
  name: { type: String, required: true },
});

const Category = model('Student', CatagerySchema);

export { Category, CatagerySchema };
