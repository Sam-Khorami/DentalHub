import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";



export class AddProductDto {

    @ApiProperty({ example: "Oral-B" })
    @IsString({ message: "The name field must be a string" })
    @IsNotEmpty({ message: "The name field can not be empty" })
    name!: string;

    
    @IsString({ message: "The description field can not be empty!" })
    @IsOptional()
    description!: string

}