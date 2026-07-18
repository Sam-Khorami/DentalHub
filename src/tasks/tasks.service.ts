import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleJob } from "./jobs/schedule.job";

@Injectable()
export class TasksService {

    constructor (

        private readonly scheduleJob: ScheduleJob

    ) {}

    @Cron("0 23 * * 5")
    async schedule () {

        await this.scheduleJob.schedule();

    }

    @Cron("0 22 * * 5")
    async clearSchedule () {

        await this.scheduleJob.clearSchedule();

    }

}