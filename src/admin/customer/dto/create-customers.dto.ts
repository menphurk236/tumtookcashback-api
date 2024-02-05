import {ApiProperty} from "@nestjs/swagger";

export class CreateCustomersDto {
    @ApiProperty()
    company: string

    @ApiProperty()
    name: string

    @ApiProperty()
    tax: string

    @ApiProperty()
    tel: string
}
