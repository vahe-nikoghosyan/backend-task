import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (user) {
      // Implement file deletion logic here
      await this.userModel
        .updateOne({ _id: userId }, { $unset: { avatar: '' } })
        .exec();
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './schemas/user.schema';
// import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
// import * as fs from 'fs';
// import * as path from 'path';
// import { CreateUserDto } from './dto/create-user.dto';
//
// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     private rabbitMQService: RabbitMQService,
//     // private httpService: HttpService,
//   ) {}
//
//   async createUser(createUserDto: CreateUserDto): Promise<User> {
//     const createdUser = new this.userModel(createUserDto);
//     await createdUser.save();
//     await this.rabbitMQService.sendToQueue(
//       'emailQueue',
//       JSON.stringify(createdUser),
//     );
//     await this.rabbitMQService.sendToQueue(
//       'userEventQueue',
//       JSON.stringify(createdUser),
//     );
//     return createdUser;
//   }
//
//   async getUser(userId: string): Promise<User> {
//     const response = await this.httpService
//       .get(`https://reqres.in/api/users/${userId}`)
//       .toPromise();
//     return response.data;
//   }
//
//   async getUserAvatar(userId: string): Promise<string> {
//     const user = await this.userModel.findById(userId).exec();
//     const avatarPath = path.resolve(__dirname, `../avatars/${userId}.png`);
//
//     if (fs.existsSync(avatarPath)) {
//       const avatar = fs.readFileSync(avatarPath);
//       return avatar.toString('base64');
//     } else {
//       const response = await this.httpService
//         .get(user.avatar, { responseType: 'arraybuffer' })
//         .toPromise();
//       const avatar = Buffer.from(response.data);
//       fs.writeFileSync(avatarPath, avatar);
//       return avatar.toString('base64');
//     }
//   }
//
//   async deleteUserAvatar(userId: string): Promise<void> {
//     const user = await this.userModel.findById(userId).exec();
//     const avatarPath = path.resolve(__dirname, `../avatars/${userId}.png`);
//     if (fs.existsSync(avatarPath)) {
//       fs.unlinkSync(avatarPath);
//     }
//     await this.userModel.deleteOne({ _id: userId }).exec();
//   }
// }
