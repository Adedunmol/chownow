import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuItemDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'rice' })
    item_name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ default: 10 })
    price: number;
}
