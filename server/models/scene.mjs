import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

const SceneSchema = new mongoose.Schema({
  atlas: {
    type: String,
    required: true,
  },
  effect: {
    type: String,
    required: true,
  },
  scene: {
    type: String,
    required: true,
  },
  background: {
    type: Number,
    required: true,
  },
  resolution: {
    type: Number,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: { type: String, required: true },
  slug: { type: String, slug: 'title', unique: true },
  createdAt: { type: Date, index: -1 },
  updatedAt: { type: Date, index: -1 },
}, { timestamps: true });

SceneSchema.plugin(slug);

export default mongoose.model('Scene', SceneSchema);
