import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class UpdateCategoryDto {

    @ApiProperty({ example: "hygienic", description: "Enter the name field" })
    @IsNotEmpty({ message: "The name field does not exist" })
    @IsString({ message: "The name field must be a string" })
    name!: string;

}