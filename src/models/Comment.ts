import { model, Schema, Types } from 'mongoose';

const CommentSchema = new Schema({
  user: { type: Types.ObjectId, required: true },
  lesson: { type: Types.ObjectId, required: true },
  text: { type: String, required: true, maxlength: 255 },
});

const Comment = model('Comment', CommentSchema);

export { Comment, CommentSchema };
