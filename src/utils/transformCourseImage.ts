// utils/imageProcessor.ts
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const transformCourseImage = async (filepath: string) => {
  const outputPath = filepath;

  const watermarkPath = path.join(
    process.cwd(),
    'src',
    'assets',
    'watermark.png',
  );

  if (!fs.existsSync(watermarkPath)) {
    throw new Error('Файл водяного знака не найден');
  }

  await sharp(filepath)
    .resize(900)
    .composite([
      {
        input: watermarkPath,
        gravity: 'southeast', // правый нижний угол
        blend: 'overlay',
      },
    ])
    .jpeg({ quality: 80 })
    .toFile(outputPath);
};
