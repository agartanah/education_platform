import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const transformCourseImage = async (
  filepath: string,
): Promise<string> => {
  try {
    const ext = path.extname(filepath);
    const filename = path.basename(filepath, ext);
    const dir = path.dirname(filepath);
    const outputPath = path.join(dir, `${filename}_processed${ext}`);

    if (!fs.existsSync(filepath)) {
      throw new Error(`Исходный файл не найден: ${filepath}`);
    }

    const watermarkPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'watermark.png',
    );

    if (!fs.existsSync(watermarkPath)) {
      throw new Error(`Водяной знак не найден: ${watermarkPath}`);
    }

    const sharpTransform = sharp()
      .resize(900)
      .composite([
        {
          input: watermarkPath,
          gravity: 'southeast',
        },
      ])
      .jpeg({ quality: 80 });

    const readStream = fs.createReadStream(filepath);
    const writeStream = fs.createWriteStream(outputPath);

    readStream.on('error', (err) => {
      console.error('Ошибка чтения файла:', err);
      throw err;
    });

    sharpTransform.on('error', (err) => {
      console.error('Ошибка обработки Sharp:', err);
      throw err;
    });

    writeStream.on('error', (err) => {
      console.error('Ошибка записи файла:', err);
      throw err;
    });

    await new Promise<void>((resolve, reject) => {
      readStream
        .pipe(sharpTransform)
        .pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    try {
      await fs.promises.unlink(filepath);
      await fs.promises.rename(outputPath, filepath);

      return filepath;
    } catch (replaceError) {
      console.error(
        'Ошибка при замене, но обработанное изображение создано:',
        replaceError,
      );
      return outputPath;
    }
  } catch (error) {
    console.error('Не удалось обработать изображение:', error);
    return filepath;
  }
};
