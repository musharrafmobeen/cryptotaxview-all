import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JoiValidationPipe } from '../../common/pipes/validation.pipe';
import {
  creatRoleSchema,
  updateRoleSchema,
  uuidSchema,
} from '../../common/contants/joi-validation-schemas';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(
    @Body(new JoiValidationPipe(creatRoleSchema)) createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new JoiValidationPipe(uuidSchema)) id: string) {
    return this.rolesService.findOne(id);
  }

  /*
 As discussed with Musharraf and Saqib Javed for the time being code to 
 update has been commented out.
*/

  // @Patch(':id')
  // update(
  //   @Param('id', new JoiValidationPipe(uuidSchema)) id: string,
  //   @Body(new JoiValidationPipe(updateRoleSchema)) updateRoleDto: UpdateRoleDto,
  // ) {
  //   return this.rolesService.update(id, updateRoleDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
