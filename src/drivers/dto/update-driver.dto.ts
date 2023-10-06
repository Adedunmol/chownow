import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDriverDto } from './create-driver.dto';

export class UpdateDriverAdminDto extends PartialType(OmitType(CreateDriverDto, ['password'] as const)) {}
export class UpdateDriverDto extends PartialType(CreateDriverDto) {}
