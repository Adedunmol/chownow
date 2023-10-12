import { IsString, IsStrongPassword, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ default: 10 })
    street_number: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'test str' })
    address_line1: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ default: 'test str' })
    address_line2?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'test' })
    city: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'test' })
    region: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: '232123' })
    postal_code: string;
}