import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { events } from 'src/common/events/eventEmitter';
import { Repository } from 'typeorm';
import { CreateUserFileDto } from './dto/create-user-file.dto';
import { UpdateUserFileDto } from './dto/update-user-file.dto';
import { UserFile } from './entities/user-file.entity';

@Injectable()
export class UserFilesRepository {
  constructor(
    @Inject('USER_FILE_REPOSITORY')
    private userFileRepository: Repository<UserFile>,
  ) {}

  async create(createUserFileDto: CreateUserFileDto, userID: string) {
    const files = await this.userFileRepository.find({
      where: { user: userID },
    });
    await this.userFileRepository.remove(files);
    // const userFiles = await this.userFileRepository.find({
    //   where: {
    //     originalFileName: createUserFileDto.originalFileName,
    //     user: userID,
    //   },
    // });
    // if (userFiles.length > 0) {
    //   return await this.userFileRepository.save(userFiles[0]);
    // }
    return await this.userFileRepository.save(createUserFileDto);
  }

  async createReport(createUserFileDto: CreateUserFileDto, userID: string) {
    // const files = await this.userFileRepository.find({
    //   where: { user: userID },
    // });
    // await this.userFileRepository.remove(files);
    const userFiles = await this.userFileRepository.find({
      where: {
        originalFileName: createUserFileDto.originalFileName,
        user: userID,
      },
    });
    if (userFiles.length > 0) {
      return await this.userFileRepository.save(userFiles[0]);
    }
    return await this.userFileRepository.save(createUserFileDto);
  }

  async createAppend(createUserFileDto: CreateUserFileDto, userID: string) {
    const userFiles = await this.userFileRepository.find({
      where: {
        originalFileName: createUserFileDto.originalFileName,
        user: userID,
      },
    });
    if (userFiles.length > 0) {
      events.eventFailed();
      throw new HttpException(
        'File with same name already exists. Change file name!',
        HttpStatus.CONFLICT,
      );
    }
    return await this.userFileRepository.save(createUserFileDto);
  }

  async findAll(user: string, type: boolean) {
    return await this.userFileRepository.find({ where: { user, type } });
  }

  findOne(id: string, user: string) {
    return this.userFileRepository.find({ where: { id, user } });
  }

  update(id: number, updateUserFileDto: UpdateUserFileDto) {
    return `This action updates a #${id} userFile`;
  }

  async remove(id: string) {
    const file = await this.userFileRepository.findOne({
      where: { id },
    });
    if (file) {
      return await this.userFileRepository.remove(file);
    }

    return {};
  }

  async removeByExchange(user, exchange) {
    const files = await this.userFileRepository.find({
      where: { user, exchange },
    });
    const filenames = new Set();
    for (let i = 0; i < files.length; i++) {
      if (!filenames.has(files[i].fileName)) filenames.add(files[i].fileName);
    }

    await this.userFileRepository.remove(files);
    return Array.from(filenames);
  }

  async removeMultiple(user, fileNames) {
    const files = await this.userFileRepository.find({ where: { user } });
    const filenames = new Set();
    for (let i = 0; i < fileNames.length; i++) {
      filenames.add(fileNames[i]);
    }
    const filesToBeDeleted = files.filter((file) =>
      filenames.has(file.fileName),
    );

    return this.userFileRepository.remove(filesToBeDeleted);
  }
}
