import mongoose from 'mongoose';
import sharp from 'sharp';

const ScreenshotSchema = new mongoose.Schema({
  buffer: {
    type: Buffer,
    required: true,
  },
  scene: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene',
    required: true,
    index: true,
    unique: true,
  },
}, { timestamps: true });

ScreenshotSchema.pre('save', function onSave(next) {
  const screenshot = this;
  if (screenshot.isModified('buffer')) {
    return sharp(screenshot.buffer)
      .webp({ lossless: true })
      .toBuffer()
      .then((buffer) => {
        screenshot.buffer = buffer;
        next();
      })
      .catch(next);
  }
  return next();
});

export default mongoose.model('Screenshot', ScreenshotSchema);
