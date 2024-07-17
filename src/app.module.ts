import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { UsersModule } from './users/users.module';

const DEFAULT_MONGODB_URL = 'mongodb://localhost:27017/nest-task';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || DEFAULT_MONGODB_URL),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitmqService],
})
export class AppModule {}
