import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleJob } from "./jobs/schedule.job";

@Injectable()
export class TasksService {

    constructor (

        private readonly scheduleJob: ScheduleJob

    ) {}

    // "0 23 * * 5"
    @Cron(CronExpression.EVERY_30_SECONDS)
    async schedule () {

        await this.scheduleJob.schedule();

    }

}