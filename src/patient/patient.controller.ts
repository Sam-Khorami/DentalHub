import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { RequestToAdminDto } from "./dto/requestToAdmin.dto";
import { DayOfWeekEnum } from '../enums/entity.enums';

@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth()
@ApiTags("Patient Management")
@Controller('patient')
export class PatientController {

  constructor(private readonly patientService: PatientService) {}

  @Post("request-to-admin")
  async requestToAdmin (@Body() data: RequestToAdminDto, @Req() request: Request) {
  
    await this.patientService.requestToAdmin(data, request);
    return { message: "Your request has sent to admins" }
  
  }

  @Get("available-appointments")
  async availableAppointments (@Query("day") day: DayOfWeekEnum) {

    const appointments = await this.patientService.availableAppointments(day);
    return { appointments } 

  }

}
