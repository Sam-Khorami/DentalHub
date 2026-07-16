import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { SetScheduleDto } from './dto/setSchedule.dto';
import { ChangeScheduleDto } from './dto/changeSchedule.dto';

@ApiTags("Doctors Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('doctor')
export class DoctorController {

  constructor(private readonly doctorService: DoctorService) {}

  @Permission("schedule:create")
  @Post("set-schedule")
  async setSchedule (@Body() data: SetScheduleDto, @Req() request: Request) {

    await this.doctorService.setSchedule(data, request);
    return { message: "Schedule has been set" }


  }

  @Permission("schedule:change")
  @Put("change-schedule/:slotId")
  async changeSchedule (@Param("slotId", ParseIntPipe) slotId: number, @Body() data: ChangeScheduleDto, @Req() request: Request) {

    await this.doctorService.changeSchedule(data, slotId, request);
    return { message: "Schedule changed successfully!" }

  }

  @Delete("delete-schedule/:scheduleId")
  async deleteSchedule (@Param("scheduleId", ParseIntPipe) scheduleId: number, @Req() request: Request) {

    await this.doctorService.deleteSchedule(scheduleId, request);
    return { message: "The schedule deleted successfully" }

  }

  @Permission("schedule:read")
  @Get("get-schedules")
  async getSchedules (@Req() request: Request) {

    const schedules = await this.doctorService.getSchedules(request);
    return { schedules }

  }

  @Permission("schedule:read")
  @Get("get-schedule/:scheduleId")
  async getSchedule (@Param("scheduleId", ParseIntPipe) scheduleId: number, @Req() request: Request) {

    const schedule = await this.doctorService.getSchedule(scheduleId, request);
    return { schedule }

  }

}
