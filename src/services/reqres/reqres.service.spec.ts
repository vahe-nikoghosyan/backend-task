import { Test, TestingModule } from '@nestjs/testing';
import { ReqresService } from './reqres.service';
import {
  mockReqresUserResponse,
  mockCreateUserResponse,
} from '../../mocks/reqres.mock';
import axios from 'axios';

jest.mock('axios');

describe('ReqresService', () => {
  let service: ReqresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqresService],
    }).compile();

    service = module.get<ReqresService>(ReqresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return the response', async () => {
      (axios.post as jest.Mock).mockResolvedValue(mockCreateUserResponse);

      const result = await service.createUser('John Doe');
      expect(result).toEqual(mockCreateUserResponse.data);
      expect(axios.post).toHaveBeenCalledWith('https://reqres.in/api/users', {
        name: 'John Doe',
      });
    });
  });

  describe('getUser', () => {
    it('should return a user from reqres', async () => {
      (axios.get as jest.Mock).mockResolvedValue(mockReqresUserResponse);

      const result = await service.getUser('2');
      console.log('reeeeee', result);
      expect(result).toEqual(mockReqresUserResponse.data.data);
      expect(axios.get).toHaveBeenCalledWith('https://reqres.in/api/users/2');
    });
  });
});
