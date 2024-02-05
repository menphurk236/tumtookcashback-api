import {ApiProperty} from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty()
    customerId: number

    @ApiProperty()
    deposit: number

    @ApiProperty()
    withdraw: number

    @ApiProperty()
    remark: string
}

export enum TransactionEnum {
    WITHDRAW = 'WITHDRAW',
    DEPOSIT = 'DEPOSIT',
}

