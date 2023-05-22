import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from '../../common/pipes/validation.pipe';
import {
  createUserSchema,
  updateAccountSettings,
  updatePasswordUserSchema,
  updateProfileSchema,
  updateUserSchema,
  uuidSchema,
} from '../../common/contants/joi-validation-schemas';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage, checkFileType } from 'src/config/multer/multer.config';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from '../exchanges-wrapper/common/sleep';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
    @Body('role') roleShortCode: string,
  ) {
    return this.usersService.create(roleShortCode, createUserDto);
  }

  @Post('multiple-invitation')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,

      limits: { fileSize: 1200000 },
      fileFilter: (_req, file, cb) => {
        checkFileType(file, cb);
      },
    }),
  )
  async userEmailInvitations(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.usersService.usersEmailInvitations(file, String(req.user));
  }

  @Post('users-invitation')
  async userEmailInvitation(@Body() body: any) {
    return await this.usersService.userEmailInvitation(body.users, body.userID);
  }

  @Post('user-invite')
  async userInvitation(@Body() body: any) {
    return await this.usersService.singleUserEmailInvitation(
      body.userToBeInvited,
      body.userID,
    );
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new JoiValidationPipe(uuidSchema)) id: string,
    @Body(new JoiValidationPipe(updatePasswordUserSchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // new JoiValidationPipe(updateProfileSchema)
  @Patch('profile/:id')
  updateProfile(
    @Param('id', new JoiValidationPipe(uuidSchema)) id: string,
    @Body(new JoiValidationPipe(updateProfileSchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Patch('settings/:id')
  updateAccountSettings(
    @Param('id', new JoiValidationPipe(uuidSchema)) id: string,
    @Body(new JoiValidationPipe(updateAccountSettings))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.usersService.remove(id);
  }
}
