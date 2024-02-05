import {ApiProperty} from "@nestjs/swagger";

export enum RoleEnum {
    admin = 'admin',
    superAdmin = 'superAdmin',
    participant = 'participant',
}
export class CreateUserDto {
    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string

    @ApiProperty()
    username: string

    @ApiProperty()
    password: string

    @ApiProperty()
    confirmPassword?: string

    @ApiProperty()
    tel: string

    @ApiProperty()
    role: RoleEnum
}
