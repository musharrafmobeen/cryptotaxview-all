import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JoiValidationPipe } from '../../common/pipes/validation.pipe';
import {
  createPermissionSchema,
  updatePermissionSchema,
  uuidSchema,
} from '../../common/contants/joi-validation-schemas';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(createPermissionSchema))
    createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new JoiValidationPipe(uuidSchema)) id: string,
    @Body(new JoiValidationPipe(updatePermissionSchema))
    updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.permissionsService.remove(id);
  }
}
