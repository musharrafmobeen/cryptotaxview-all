import { PartialType } from '@nestjs/swagger';
import { CreateCsvConfigurationDto } from './create-csv-configuration.dto';

export class UpdateCsvConfigurationDto extends PartialType(CreateCsvConfigurationDto) {}
