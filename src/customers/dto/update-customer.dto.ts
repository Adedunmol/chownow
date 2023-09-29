import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerAdminDto extends OmitType(CreateCustomerDto, ['password'] as const) {}
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
