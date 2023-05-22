import { BadRequestException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';

export const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'file') {
      cb(null, './uploads/order-history-imports/');
    }
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'file') {
      // console.log('storing file.', file.originalname, 'path.extname', file);
      cb(null, file.originalname);
    }
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 12000000 },
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb);
  },
});

export function checkFileType(file, cb) {
  // console.log('Checking file type.');
  if (file.fieldname === 'file') {
    // console.log('Incoming File MimeTpe: ', file.mimetype);
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      // check file type to be csv
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `File type is not compatible. Required MimeType is 'tex/csv' OR 'application/vnd.ms-excel', '${file.mimetype}' given.`,
        ),
        // null,
        false,
      ); // else fails
    }
  }
}

MulterModule.register({
  storage: storage,
  limits: { fileSize: 12000000 },
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb);
  },
});
