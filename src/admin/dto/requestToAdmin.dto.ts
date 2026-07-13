import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RequestEnum } from "../../enums/entity.enums"


export class RequestToAdminDto {

    @ApiProperty({ enum: RequestEnum, enumName: "RequestEnum", example: RequestEnum.BeingClerk, description: "Enter The request" })
    @IsNotEmpty({ message: "Request can not be empty!" })
    @IsEnum(RequestEnum)
    request!: string;

    @IsString({ message: "The description field must be a string" })
    @IsOptional()
    description!: string;

}