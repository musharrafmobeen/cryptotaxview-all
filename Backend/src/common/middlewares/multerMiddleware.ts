import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UseInterceptors,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';
import { checkFileType, storage } from 'src/config/multer/multer.config';

const multerFunc = () => {
  FileInterceptor('file', {
    storage: storage,
    limits: { fileSize: 1200000 },
    fileFilter: (_req, file, cb) => {
      checkFileType(file, cb);
    },
  });
};

@Injectable()
export class multerMiddleware implements NestMiddleware {
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
      limits: { fileSize: 1200000 },
      fileFilter: (_req, file, cb) => {
        checkFileType(file, cb);
      },
    }),
  )
  use(req: Request, res: Response, next: NextFunction) {
    multerFunc();
    next();
  }
}
