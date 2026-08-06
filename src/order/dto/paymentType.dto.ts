import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export enum PaymentTypeEnum { Wallet = "wallet", PaymentGateway = "paymentGateway" }

export class PaymentTypeDto {

    @ApiPropertyOptional({ example: PaymentTypeEnum.PaymentGateway, description: "Enter the type field paymentGateway or wallet" })
    @IsNotEmpty({ message: "The type field can not be empty" })
    @IsEnum(PaymentTypeEnum)
    type?: PaymentTypeEnum;

}