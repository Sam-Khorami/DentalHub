import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { DayOfWeekEnum, ServiceTypeEnum } from "../../enums/entity.enums";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class AvailableAppointmentsDto {

    @ApiPropertyOptional({ enum: DayOfWeekEnum, enumName: "DayOfWeekEnum", example: DayOfWeekEnum.Sunday, description: "Filter appointments by day of the week"})
    @IsOptional()
    @IsEnum(DayOfWeekEnum)
    day?: DayOfWeekEnum;

    @ApiPropertyOptional({ type: Number, example: 12, description: "Filter appointments by doctor ID"})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    doctorId?: number;

    @ApiPropertyOptional({ enum: ServiceTypeEnum, enumName: "ServiceTypeEnum", example: ServiceTypeEnum.Filling, description: "Filter appointments by service type"})
    @IsOptional()
    @IsEnum(ServiceTypeEnum)
    serviceType?: ServiceTypeEnum;

}