import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RabbitMQService } from '../services/rabbitmq/rabbitmq.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ReqresService } from '../services/reqres/reqres.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rabbitMQService: RabbitMQService,
    private reqresService: ReqresService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = await this.userModel.create(createUserDto);

    const reqresUser = await this.reqresService.createUser(createUserDto.name);
    createdUser.apiUserId = reqresUser.id;

    await createdUser.save();

    await this.rabbitMQService.sendToQueue(
      'emailQueue',
      JSON.stringify(createdUser),
    );
    await this.rabbitMQService.sendToQueue(
      'userEventQueue',
      JSON.stringify(createdUser),
    );
    return createdUser;
  }

  async findOne(userId: string) {
    return this.reqresService.getUser(userId);
  }

  async getUserAvatar(userId: string) {
    const user = await this.userModel.findOne({ apiUserId: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const avatarUrl = user.avatar;
    const avatarDir = path.resolve(__dirname, '../avatars');
    const avatarPath = path.resolve(avatarDir, `${userId}.png`);

    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir);
    }

    if (fs.existsSync(avatarPath)) {
      const avatar = fs.readFileSync(avatarPath);
      return avatar.toString('base64');
    } else {
      const response = await axios.get(avatarUrl, {
        responseType: 'arraybuffer',
      });
      const avatar = Buffer.from(response.data);
      fs.writeFileSync(avatarPath, avatar);
      return avatar.toString('base64');
    }
  }

  async deleteAvatar(userId: string) {
    const user = await this.userModel.findOne({ reqresId: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const avatarPath = path.resolve(__dirname, `../avatars/${userId}.png`);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
    await this.userModel.deleteOne({ apiUserId: userId });
  }
}
