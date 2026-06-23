import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { AuthService } from "../auth/auth.service";



@Injectable()
export class PermissionGuard implements CanActivate {

    constructor (

        private reflector: Reflector,
        private authService: AuthService

    ) {}

    async canActivate(context: ExecutionContext) {
        
        const permissions: string[] = this.reflector.getAllAndOverride(PERMISSION_KEY, [ context.getHandler(), context.getClass() ]);
        if (!permissions) return true;

        const request = context.switchToHttp().getRequest();
        const user = request["user"];

        const userPermissions = await this.authService.getPermissions(user.userId);
        const check = permissions.every((val) => userPermissions.includes(val) );        

        return check;

    }

}