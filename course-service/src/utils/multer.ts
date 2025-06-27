import fs from 'fs';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import type { Request as MulterRequest } from 'express-serve-static-core';
import { v4 as uuidv4 } from 'uuid';

const fileFilter = (
  _: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Invalid file type'));
  } else {
    cb(null, true);
  }
};

const createUploader = (folder: string, subFolder: string): multer.Multer => {
  const storage: StorageEngine = multer.diskStorage({
    destination: (_, __, cb) => {
      const uploadPath = path.join(process.cwd(), folder, subFolder);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuidv4()}${ext}`;

      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: folder === 'images' ? 10 * 1024 * 1024 : 100 * 1024 * 1024,
    },
    fileFilter,
  });
};

const uploaders = {
  courses: createUploader('images', 'course').single('image'),
  lessons: createUploader('videos/original', 'lesson').single('video'),
};

export default uploaders;
