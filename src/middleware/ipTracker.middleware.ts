import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { IpService } from "../ip/ip.service";



@Injectable()
export class IpTracker implements NestMiddleware {

    constructor (private ipService: IpService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        
        await this.ipService.ipTracker(req.ip!);
        next();

    }

}