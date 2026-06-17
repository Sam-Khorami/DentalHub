import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): any {
        
        const now = Date.now()

        return next.handle().pipe(

            tap(() => {

                return console.log(`Process Time is ${Date.now() - now}`);

            })

        );

    }

}