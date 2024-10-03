import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../users.dto';
import { UserResponseObject } from 'src/shared/interfaces/response-objects/UserResponseObject';

class UsersServiceMock {
  getUsers = jest.fn();
  getUserById = jest.fn();
  createUser = jest.fn();
  deleteUser = jest.fn();
}

describe('UsersController', () => {
  // Setup

  let app: INestApplication;
  const usersServiceMock = new UsersServiceMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  // Data

  const userResponseMock: UserResponseObject[] = [
    {
      _id: '1',
      email: 'johndoes@mail.com',
      userRole: 1,
      userAuthProvider: 1,
    },
  ];

  const createUserDto: CreateUserDto = {
    email: 'johndoes@mail.com',
    password: 'pass',
  };

  // Tests

  describe('/POST users', () => {
    it('should create a new user', async () => {
      usersServiceMock.createUser.mockResolvedValue(userResponseMock);

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .expect(userResponseMock);
    });
  });
});
