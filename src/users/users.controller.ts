import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get(':userId/avatar')
  getAvatar(@Param('userId') userId: string) {
    // Implement avatar retrieval logic here
  }

  @Delete(':userId/avatar')
  deleteAvatar(@Param('userId') userId: string) {
    return this.usersService.deleteAvatar(userId);
  }
}

// import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
// import { UserService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
//
// @Controller('api/users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}
//
//   @Post()
//   createUser(@Body() createUserDto: CreateUserDto) {
//     return this.userService.createUser(createUserDto);
//   }
//
//   @Get(':userId')
//   getUser(@Param('userId') userId: string) {
//     return this.userService.getUser(userId);
//   }
//
//   @Get(':userId/avatar')
//   getUserAvatar(@Param('userId') userId: string) {
//     return this.userService.getUserAvatar(userId);
//   }
//
//   @Delete(':userId/avatar')
//   deleteUserAvatar(@Param('userId') userId: string) {
//     return this.userService.deleteUserAvatar(userId);
//   }
// }
