import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URI);
      this.channel = await this.connection.createChannel();

      // await this.channel.consume('emailQueue', async (message) => {
      //   if (message) {
      //     const content = JSON.parse(message.content.toString());
      //
      //     console.log('content => ', content);
      //     this.channel.ack(message);
      //   }
      // });
    } catch (error) {
      console.error('Error connecting to RabbitMQ', error);
    }
  }

  async sendToQueue(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
