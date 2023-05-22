import { PartialType } from '@nestjs/mapped-types';
import { CreateUserplanDto } from './create-userPlan.dto';

export class UpdateUserplanDto extends PartialType(CreateUserplanDto) {}
