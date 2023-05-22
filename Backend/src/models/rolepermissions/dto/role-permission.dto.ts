import { Action } from 'src/models/actions/entities/action.entity';
import { Permission } from 'src/models/permissions/entities/permission.entity';
import { Role } from 'src/models/roles/entities/role.entity';

export class RolePermissionDto {
  shortName: string;
  shortCode: string;
}
