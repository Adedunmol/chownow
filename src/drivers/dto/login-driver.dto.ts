import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDriverDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'test' })
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Password@1234', minimum: 6 })
    password: string;
}