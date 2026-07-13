import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DayOfWeekEnum, ServiceTypeEnum } from "../../enums/entity.enums";
import { ApiProperty } from "@nestjs/swagger";


export class SetScheduleDto {

    @ApiProperty({ example: DayOfWeekEnum.Saturday, description: "Enter the dayOfWeek field" })
    @IsEnum(DayOfWeekEnum)
    @IsNotEmpty({ message: "dayOfWeek field can not be empty" })
    dayOfWeek!: DayOfWeekEnum;

    @ApiProperty({ example: "08:00:00", description: "Enter the start_time field" })
    @IsString({ message: "start_time field must be a string" })
    @IsNotEmpty({ message: "start_time field can not be empty" })
    start_time!: string;

    @ApiProperty({ example: "14:00:00", description: "Enter the end_time field" })
    @IsString({ message: "end_time field must be a string" })
    @IsNotEmpty({ message: "end_time field can not be empty" })
    end_time!: string;

    @ApiProperty({ example: 30, description: "Enter the slot_duration field" })
    @IsNotEmpty({ message: "slot_duration field can not be empty" })
    @IsInt({ message: "The slot_duration must be an integer" })
    slot_duration!: number;

    @ApiProperty({ example: ServiceTypeEnum.RootCanal, description: "Enter the service_type field" })
    @IsEnum(ServiceTypeEnum)
    @IsNotEmpty({ message: "service_type field can not be empty" })
    service_type!: ServiceTypeEnum;

    @ApiProperty({ example: true, description: "Enter the isActive field" })
    @IsOptional()
    @IsBoolean({ message: "isActive field must be a boolean" })
    isActive!: boolean;

}