import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQService } from './services/rabbitmq/rabbitmq.service';
import { UsersModule } from './users/users.module';
import { ReqresService } from './services/reqres/reqres.service';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().database.uri),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQService, ReqresService],
})
export class AppModule {}
