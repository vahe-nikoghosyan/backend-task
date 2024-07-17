import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { RabbitMQService } from '../services/rabbitmq/rabbitmq.service';
import { ReqresService } from '../services/reqres/reqres.service';
import * as fs from 'fs';
import axios from 'axios';

jest.mock('fs');

describe('UsersService', () => {
  let service: UsersService;
  let model: any;
  let reqresService: any;

  beforeEach(async () => {
    reqresService = {
      createUser: jest.fn(),
      getUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            sendToQueue: jest.fn(),
          },
        },
        {
          provide: ReqresService,
          useValue: reqresService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
    apiUser: '2',
    save: jest.fn(),
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return it', async () => {
      reqresService.createUser.mockResolvedValue({ id: '2' });
      model.create.mockResolvedValue(mockUser);
      mockUser.save.mockResolvedValue(mockUser);

      const result = await service.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user from reqres', async () => {
      const reqresUser = {
        id: '2',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'https://reqres.in/img/faces/2-image.jpg',
      };
      reqresService.getUser.mockResolvedValue(reqresUser);

      const result = await service.findOne('2');
      expect(result).toEqual(reqresUser);
    });
  });

  describe('getUserAvatar', () => {
    it('should return base64 avatar from file if exists', async () => {
      model.findOne.mockResolvedValue(mockUser);
      const mockAvatar = Buffer.from('mockAvatar'); // Use Buffer for mock data
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(mockAvatar);

      const result = await service.getUserAvatar('2');
      expect(result).toEqual(mockAvatar.toString('base64'));
    });

    it('should fetch, save, and return base64 avatar if file does not exist', async () => {
      model.findOne.mockResolvedValue(mockUser);
      const mockAvatar = Buffer.from('mockAvatar'); // Make sure this is a Buffer
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const response = { data: mockAvatar };
      jest.spyOn(axios, 'get').mockResolvedValueOnce(response);

      const result = await service.getUserAvatar('2');
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result).toEqual(mockAvatar.toString('base64'));
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar file and db entry', async () => {
      model.findOne.mockResolvedValue(mockUser);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      model.deleteOne.mockResolvedValue({ deletedCount: 1 }); // Mock deleteOne

      await service.deleteAvatar('2');
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(model.deleteOne).toHaveBeenCalledWith({ apiUserId: '2' });
    });
  });
});
