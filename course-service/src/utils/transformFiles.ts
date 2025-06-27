import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import fspromise from 'fs/promises';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const resolutions = [
  { label: '144p', height: 144 },
  { label: '240p', height: 240 },
  { label: '360p', height: 360 },
  { label: '480p', height: 480 },
  { label: '720p', height: 720 },
  { label: '1080p', height: 1080 },
];

export const transformCourseImage = async (
  filepath: string,
): Promise<boolean> => {
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

      return true;
    } catch (replaceError) {
      console.error(
        'Ошибка при замене, но обработанное изображение создано:',
        replaceError,
      );
      return false;
    }
  } catch (error) {
    console.error('Не удалось обработать изображение:', error);
    return false;
  }
};

export const transformLessonVideo = async (
  filepath: string,
): Promise<boolean> => {
  try {
    const ext = path.extname(filepath);
    const filename = path.basename(filepath, ext);
    const dir = path.join(process.cwd(), 'videos', 'processed');

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await Promise.all(
      resolutions.map(({ label, height }) => {
        const outputPath = path.join(dir, `${filename}_${label}.mp4`);

        return new Promise<void>((resolve, reject) => {
          const args = [
            '-i',
            filepath,
            '-vf',
            `scale=-2:${height}`,
            '-c:a',
            'copy',
            '-y',
            outputPath,
          ];

          const ffmpeg = spawn(ffmpegPath as string, args);

          ffmpeg.stderr.on('data', (data) => {
            console.log(`ffmpeg stderr: ${data}`);
          });

          ffmpeg.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited with code ${code}`));
          });

          ffmpeg.on('error', (err) => reject(err));
        });
      }),
    );

    return true;
  } catch (error) {
    console.error('Не удалось обработать видео: ', error);
    return false;
  }
};

export const deleteVideoLesson = async (filename: string): Promise<boolean> => {
  try {
    const originalDir = path.join(process.cwd(), 'videos', 'original');
    const processedDir = path.join(process.cwd(), 'videos', 'processed');

    const originalFile = fs
      .readdirSync(originalDir)
      .find((file) => file.startsWith(filename));

    if (originalFile) {
      const originalPath = path.join(originalDir, originalFile);
      if (fs.existsSync(originalPath)) {
        await fspromise.unlink(originalPath);
      }
    }

    for (const { label } of resolutions) {
      const processedFile = path.join(processedDir, `${filename}_${label}.mp4`);
      if (fs.existsSync(processedFile)) {
        await fspromise.unlink(processedFile);
      }
    }

    return true;
  } catch (error) {
    console.error('Не удалось удалить видео: ', error);
    return false;
  }
};
