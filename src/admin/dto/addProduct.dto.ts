import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";



export class AddProductDto {

    @ApiProperty({ example: "Oral-B" })
    @IsString({ message: "The name field must be a string" })
    @IsNotEmpty({ message: "The name field can not be empty" })
    name!: string;

    @IsString({ message: "The description field can not be empty!" })
    @IsOptional()
    description!: string

    @ApiProperty({ example: 10 })
    @IsInt({ message: "The quantity field must be an integer" })
    @IsNotEmpty({ message: "The quantity field can not be empty" })
    quantity!: number;

    @ApiProperty({ example: 1000000 })
    @IsInt({ message: "The price field must be an integer" })
    @IsNotEmpty({ message: "The price field can not be empty" })
    price!: number;

}