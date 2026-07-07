import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { Permission } from './entity/permission.entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { Otp } from './entity/otp.entity';
import { SeedModule } from './seed/seed.module';
import { IpModule } from './ip/ip.module';
import { Ip } from './entity/ip.entity';
import { IpTracker } from './middleware/ipTracker.middleware';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './entity/profile.entity';
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({

      type: "mysql",
      synchronize: true,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT!,
      password: process.env.DB_PASS,
      username: process.env.DB_USER,
      entities: [User, Role, Permission, Otp, Ip, Profile]

    }),
    CacheModule.registerAsync({

      isGlobal: true,
      useFactory: async () => ({

        stores: [ new KeyvRedis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`) ]

      })

    }),
    AuthModule,
    MailModule,
    SeedModule,
    IpModule,
    TasksModule,
    UsersModule,
    ProfileModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    
    consumer.apply(IpTracker).forRoutes("*")

  }

}
