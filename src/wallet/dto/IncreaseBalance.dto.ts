import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class IncreaseBalanceDto {

    @ApiProperty({ example: 1000000, description: "Enter the amount field (Notice: The amount is IRT)" })
    @Min(10000, { message: "The lowest entered amount can not be less than 10000 IRT" })
    @Max(50000000, { message: "The higher entered amount can not be greater than 50000000 IRT" })
    @IsNotEmpty({ message: "The amount field can not be empty" })
    @IsInt({ message: "The amount field must be an interger" })
    amount!: number;

}