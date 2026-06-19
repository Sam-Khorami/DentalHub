import { Injectable } from '@nestjs/common';
import { CleanUp } from './jobs/cleanUp.job';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {

    constructor (private cleanUp: CleanUp) {}

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async otpCleanup () {

        await this.cleanUp.otpCleanup();

    }

}
