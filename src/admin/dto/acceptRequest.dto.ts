import { IsEnum } from "class-validator";
import { UserRole } from "../../enums/entity.enums"
import { ApiProperty } from "@nestjs/swagger";


export class AcceptRequestDto {

    @ApiProperty({ enum: UserRole, enumName: "UserRole", description: "Select the role for the user", example: UserRole.Dentist })
    @IsEnum(UserRole)
    role!: UserRole;

}