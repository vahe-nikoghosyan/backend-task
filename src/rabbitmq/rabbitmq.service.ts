import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

const DEFAULT_RABBITMQ_URI = 'amqp://localhost:5672';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URI || DEFAULT_RABBITMQ_URI,
    );
    this.channel = await this.connection.createChannel();
  }

  async sendToQueue(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }
}
