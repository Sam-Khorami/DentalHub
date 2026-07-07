import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { Permission } from '../entity/permission.entity';

@Module({
  imports: [
    
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({

      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({

        secret: configService.get<string>("JWT_SECRET_KEY"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRATION") }

      }),

    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
    MailModule
    
  
  ],
  
  
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
