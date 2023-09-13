import { IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {

    @IsString()
    @ApiProperty({ default: 'Montag' })
    username: string;
    
    @IsString()
    @ApiProperty({ default: 'Montag' })
    first_name: string;

    @IsString()
    @ApiProperty({ default: 'Guy' })
    last_name: string;
    
    @IsString()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minUppercase: 1 })
    @ApiProperty({ default: 'Password1234', minimum: 6 })
    password: string;
}
