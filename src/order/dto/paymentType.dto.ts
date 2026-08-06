import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export enum PaymentTypeEnum { Wallet = "wallet", PaymentGateway = "paymentGateway" }

export class PaymentTypeDto {

    @ApiProperty({ example: PaymentTypeEnum.PaymentGateway, description: "Enter the type field" })
    @IsNotEmpty({ message: "The type field can not be empty" })
    @IsEnum(PaymentTypeEnum)
    type?: PaymentTypeEnum;

}