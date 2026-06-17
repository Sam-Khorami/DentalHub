import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";


@Catch()
export class GlobalException implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        
      const context = host.switchToHttp();

      const request = context.getRequest();
      const response: Response = context.getResponse();

      let status = 500;
      let message: any = "Internal Server Error";

      if (exception instanceof HttpException) {

        status = exception.getStatus();
        message = exception.getResponse();

      }

      else {
            
        console.log(exception);
        message = exception.message;

      }

      response.status(status).json({ success: false, message: message.message, status });

    }

}