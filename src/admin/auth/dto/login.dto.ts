import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @ApiProperty({
        default: 'admin'
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    // @MinLength(6)
    @ApiProperty({
        default: '123456'
    })
    password: string;
}