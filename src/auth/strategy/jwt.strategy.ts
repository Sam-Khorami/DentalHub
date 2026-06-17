import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor (private configService: ConfigService) {

        const secret = configService.get("JWT_SECRET_KEY");

        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            ignoreExpiration: false

        })

    }

    validate(payload: any) {
        
        return {

            userId: payload.userId,
            username: payload.username,
            role: payload.role

        }

    }

}  