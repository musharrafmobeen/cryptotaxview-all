import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class userMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new HttpException('No Token Found', HttpStatus.NOT_FOUND);
    } else {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);
        if (decoded) {
          const { id } = decoded;
          req.body.userID = id;
          req.user = id;
          next();
        } else {
          throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
      } catch (e) {
        throw new HttpException('Login Expired', 419);
      }
    }
  }
}
