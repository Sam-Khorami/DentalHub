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
import { SeedModule } from './seed/seed.module';
import { IpModule } from './ip/ip.module';
import { Ip } from './entity/ip.entity';
import { IpTracker } from './middleware/ipTracker.middleware';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './entity/profile.entity';
import { CacheModule } from "@nestjs/cache-manager";
import { AdminModule } from './admin/admin.module';
import KeyvRedis from "@keyv/redis";
import { Requests } from './entity/request.entity';
import { DoctorSchedule } from './entity/doctorSchedule.entity';
import { Slots } from './entity/slots.entity';
import { DoctorModule } from './doctor/doctor.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PatientModule } from './patient/patient.module';
import { Reservation } from './entity/reserve.entity';
import { Books } from './entity/book.entity';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { BasketModule } from './basket/basket.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({

      type: "mysql",
      synchronize: true,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT!,
      password: process.env.DB_PASS,
      username: process.env.DB_USER,
      entities: [User, Role, Permission, Ip, Profile, Requests, DoctorSchedule, Slots, Reservation, Books, Product, Category]

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
    UsersModule,
    ProfileModule,
    AdminModule,
    DoctorModule,
    TasksModule,
    PatientModule,
    BasketModule,
    RedisModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    
    consumer.apply(IpTracker).forRoutes("*")

  }

}
