import { Injectable } from '@nestjs/common';
import { fstat } from 'fs';
import { threadId } from 'worker_threads';
import { CreateUserFileDto } from './dto/create-user-file.dto';
import { UpdateUserFileDto } from './dto/update-user-file.dto';
import { UserFilesRepository } from './user-files.repository';
import * as fs from 'fs';
import * as path from 'path';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class UserFilesService {
  constructor(
    private readonly userFileRepository: UserFilesRepository,
    private readonly transactionRepository: TransactionsService,
  ) {}
  async create(createUserFileDto: CreateUserFileDto, userID: string) {
    return await this.userFileRepository.create(createUserFileDto, userID);
  }
  async createReport(createUserFileDto: CreateUserFileDto, userID: string) {
    return await this.userFileRepository.createReport(
      createUserFileDto,
      userID,
    );
  }

  async createAppend(createUserFileDto: CreateUserFileDto, userID: string) {
    return await this.userFileRepository.createAppend(
      createUserFileDto,
      userID,
    );
  }

  async findAll(user: string, type: boolean) {
    const data = await this.userFileRepository.findAll(user, type);
    return data.length > 0
      ? data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
      : data;
  }

  findOne(id: string, user: string) {
    return this.userFileRepository.findOne(id, user);
  }

  update(id: number, updateUserFileDto: UpdateUserFileDto) {
    return `This action updates a #${id} userFile`;
  }

  async remove(id: string) {
    return await this.userFileRepository.remove(id);
  }

  async removeFilesByExchange(user, exchange) {
    const fileNames: any = await this.userFileRepository.removeByExchange(
      user,
      exchange,
    );

    for (let i = 0; i < fileNames.length; i++) {
      const extension = fileNames[i].split('.')[1];
      if (extension === 'pdf') {
        fs.unlinkSync(path.join(__dirname, `/../../${fileNames[i]}`));
      } else if (extension === 'csv') {
        fs.unlinkSync(path.join(__dirname, `/../../../${fileNames[i]}`));
      }
    }
    return fileNames;
  }

  async removeMultiple(user, fileNames) {
    const deletedFiles = await this.userFileRepository.removeMultiple(
      user,
      fileNames,
    );
    for (let i = 0; i < fileNames.length; i++) {
      await this.transactionRepository.removeByFileName(user, fileNames[i]);
    }

    for (let i = 0; i < fileNames.length; i++) {
      const extension = fileNames[i].split('.')[1];
      if (extension === 'pdf') {
        fs.unlinkSync(path.join(__dirname, `/../../${fileNames[i]}`));
      } else if (extension === 'csv') {
        fs.unlinkSync(path.join(__dirname, `/../../../${fileNames[i]}`));
      }
    }
    return deletedFiles;
  }
}
