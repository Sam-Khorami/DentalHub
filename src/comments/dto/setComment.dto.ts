import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class SetCommentDto {

    @ApiProperty({ example: "test", description: "Enter the title field" })
    @IsNotEmpty({ message: "The title field can not be empty" })
    @IsString({ message: "The title field must be a string" })
    title!: string;

    @ApiProperty({ example: "this is a test text", description: "Enter the description field" })
    @IsString({ message: "The description field must be a string" })
    @IsOptional()
    description!: string;

}