import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCustomerDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Montag' })
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Password1234', minimum: 6 })
    password: string;
}
