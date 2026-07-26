import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateProductDto {

    @ApiProperty({ example: "Oral-A", description: "Enter The name Field" })
    @IsNotEmpty({ message: "The name field can not be empty" })
    @IsString({ message: "The name field must be a string" })
    name!: string;

    @IsString({ message: "The description must be a string" })
    @IsOptional()
    description!: string;

}