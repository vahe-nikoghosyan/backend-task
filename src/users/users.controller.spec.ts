import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService = {
    create: jest.fn().mockResolvedValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://reqres.in/img/faces/1-image.jpg',
      apiUserId: '2',
    }),
    findOne: jest.fn().mockResolvedValue({
      id: '2',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://reqres.in/img/faces/2-image.jpg',
    }),
    getUserAvatar: jest.fn().mockResolvedValue('base64Avatar'),
    deleteAvatar: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      })
      .expect(201)
      .expect({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
        apiUserId: '2',
      });
  });

  it('/api/users/2 (GET)', () => {
    return request(app.getHttpServer()).get('/api/users/2').expect(200).expect({
      id: '2',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://reqres.in/img/faces/2-image.jpg',
    });
  });

  it('/api/users/2/avatar (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users/2/avatar')
      .expect(200)
      .expect('base64Avatar');
  });

  it('/api/users/2/avatar (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/api/users/2/avatar')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
