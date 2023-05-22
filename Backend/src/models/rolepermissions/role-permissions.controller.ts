import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { JoiValidationPipe } from '../../common/pipes/validation.pipe';
import {
  createRolePermissionSchema,
  updateRolePermissionSchema,
  uuidSchema,
} from '../../common/contants/joi-validation-schemas';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(createRolePermissionSchema))
    createRolePermissionDto: CreateRolePermissionDto,
    @Body('roleId') roleId: string,
    @Body('actionId') actionId: string,
    @Body('permissionId') permissionId: string,
  ) {
    return this.rolePermissionsService.create(
      createRolePermissionDto,
      roleId,
      actionId,
      permissionId,
    );
  }

  @Get()
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.rolePermissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new JoiValidationPipe(uuidSchema)) id: string,
    @Body(new JoiValidationPipe(updateRolePermissionSchema))
    updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionsService.update(id, updateRolePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.rolePermissionsService.remove(id);
  }
}
