import { IsEnum, IsNotEmpty } from "class-validator";
import { SlotsStatusEnum } from "../../enums/entity.enums";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeScheduleDto {

    @ApiProperty({ example: SlotsStatusEnum.Cancelled, description: "Enter the status" })
    @IsEnum(SlotsStatusEnum, { message: "Invalid Status" })
    @IsNotEmpty({ message: "status field can not be empty" })
    status!: SlotsStatusEnum;

}