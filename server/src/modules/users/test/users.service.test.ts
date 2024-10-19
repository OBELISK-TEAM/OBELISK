/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from '../../../mongo/schemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../users.dto';
import { UserAuthProvider } from 'src/enums/user.auth.provider';
import { UserRole } from 'src/enums/user.role';

class UserModelMock {
  find = jest.fn();
  findOne = jest.fn();
  findById = jest.fn();
  findByIdAndUpdate = jest.fn();
  create = jest.fn();
  save = jest.fn();
}

describe('UsersService', () => {
  // Setup

  let userService: UsersService;
  const userModelMock = new UserModelMock();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: userModelMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Data

  const userId1 = '1';
  const userEmail1 = 'test1@example.com';
  const userPassword1 = 'P4$$wOrD1234';
  const userRole1 = UserRole.USER;
  const userAuthProvider1 = UserAuthProvider.INTERNAL_AND_EXTERNAL;

  const userDocument1 = {
    _id: userId1,
    email: userEmail1,
    password: userPassword1,
    userRole: userRole1,
    userAuthProvider: userAuthProvider1,
  } as UserDocument;

  const createUserDto1 = {
    email: userEmail1,
    password: userPassword1,
  } as CreateUserDto;

  const updatedUserEmail1 = 'updated@mail.com';
  const updatedUserPassword1 = 'updatedP4$$woRD';

  const updateUserDto1 = {
    email: updatedUserEmail1,
    password: updatedUserPassword1,
  } as UpdateUserDto;

  const updatedUserId1 = '1';
  const updatedUserRole1 = UserRole.ADMIN;
  const updatedUserAuthProvider1 = UserAuthProvider.GOOGLE;

  const updatedUserDocument1: UserDocument = {
    _id: updatedUserId1,
    email: updatedUserEmail1,
    password: updatedUserPassword1,
    userRole: updatedUserRole1,
    userAuthProvider: updatedUserAuthProvider1,
  } as UserDocument;

  // Tests

  describe('findUserById', () => {
    it('should return the user with the given ID as UserDocument', async () => {
      userModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userDocument1),
      });

      const result = await userService.findUserById(userId1);

      expect(result).toEqual(userDocument1);
      expect(userModelMock.findById().exec).toHaveBeenCalledTimes(1);
    });

    it('should throw 404 for a non-existing user', async () => {
      userModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(userService.findUserById(userId1)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      expect(userModelMock.findById).toHaveBeenCalledWith(userId1);
      expect(userModelMock.findById().exec).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserByEmail', () => {
    it('should return the user with the given email as UserDocument', async () => {
      userModelMock.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userDocument1),
      });

      const result = await userService.findUserByEmail(userEmail1);

      expect(result).toEqual(userDocument1);
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email: userEmail1 });
      expect(userModelMock.findOne().exec).toHaveBeenCalledTimes(1);
    });

    it('should throw 404 for a non-existing user', async () => {
      userModelMock.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(userService.findUserByEmail(userEmail1)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      expect(userModelMock.findOne).toHaveBeenCalledWith({ email: userEmail1 });
      expect(userModelMock.findOne().exec).toHaveBeenCalledTimes(1);
    });
  });

  describe('createNewUser', () => {
    userModelMock.create.mockReturnValue(userDocument1);

    it('should create a user and return the created user as UserDocument', async () => {
      // email does not exist
      userModelMock.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(false),
      });

      const result = await userService.createNewUser(createUserDto1);

      expect(result).toEqual(userDocument1);
      expect(userModelMock.create).toHaveBeenCalledWith(createUserDto1);
      expect(userModelMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUserById', () => {
    it('should update the user with the given ID and return the user as UserDocument', async () => {
      userModelMock.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUserDocument1),
      });

      const result = await userService.updateUserById(userId1, updateUserDto1);

      expect(result).toEqual(updatedUserDocument1);
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        userId1,
        updateUserDto1,
        { new: true },
      );
      expect(userModelMock.findByIdAndUpdate().exec).toHaveBeenCalledTimes(1);
    });

    it('should throw 404 for a non-existing user', async () => {
      userModelMock.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        userService.updateUserById(userId1, updateUserDto1),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        userId1,
        updateUserDto1,
        { new: true },
      );
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('emailExists', () => {
    it('should return true for existing email', async () => {
      userModelMock.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      const result = await userService.emailExists(userEmail1);

      expect(result).toBeTruthy();
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email: userEmail1 });
      expect(userModelMock.findOne().exec).toHaveBeenCalledTimes(1);
    });

    it('should return false for non-existing email', async () => {
      userModelMock.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(false),
      });

      const result = await userService.emailExists(userEmail1);

      expect(result).toBeFalsy();
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email: userEmail1 });
      expect(userModelMock.findOne().exec).toHaveBeenCalledTimes(1);
    });
  });

  describe('createGoogleUser', () => {
    it('should create a new Google user and return the created user document', async () => {
      userModelMock.create.mockReturnValue(userDocument1);

      const result = await userService.createGoogleUser(userEmail1);

      expect(result).toEqual(userDocument1);
      expect(userModelMock.create).toHaveBeenCalledWith({
        email: userEmail1,
        userAuthProvider: UserAuthProvider.GOOGLE,
      });
      expect(userModelMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleUserProvider', () => {
    it('should update an existing user to have both INTERNAL and EXTERNAL providers', async () => {
      const userWithInternalProvider = {
        ...userDocument1,
        userAuthProvider: UserAuthProvider.INTERNAL,
        save: jest.fn().mockResolvedValue(userDocument1),
      };
      userModelMock.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithInternalProvider),
      });

      const result = await userService.handleUserProvider(userEmail1);

      expect(result.userAuthProvider).toEqual(
        UserAuthProvider.INTERNAL_AND_EXTERNAL,
      );
      expect(userWithInternalProvider.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('toResponseUser', () => {
    const mockUserDocument = {
      _id: 'userId1',
      email: 'test1@example.com',
      userRole: UserRole.USER,
      userAuthProvider: UserAuthProvider.INTERNAL,
      boards: ['boardId1', 'boardId2'],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z'),
      toObject: jest.fn().mockReturnThis(),
    } as unknown as UserDocument;

    it('should return the basic UserResponseObject without boards or timestamps', () => {
      const result = userService.toResponseUser(mockUserDocument);

      expect(result).toEqual({
        _id: mockUserDocument._id,
        email: mockUserDocument.email,
        userRole: mockUserDocument.userRole,
        userAuthProvider: mockUserDocument.userAuthProvider,
      });
    });

    it('should include timestamps in the response if showTimestamps is true', () => {
      const result = userService.toResponseUser(mockUserDocument, true);

      expect(result).toEqual({
        _id: mockUserDocument._id,
        email: mockUserDocument.email,
        userRole: mockUserDocument.userRole,
        userAuthProvider: mockUserDocument.userAuthProvider,
        createdAt: mockUserDocument.createdAt,
        updatedAt: mockUserDocument.updatedAt,
      });
    });

    it('should include all fields if all flags are true', () => {
      const result = userService.toResponseUser(mockUserDocument, true);

      expect(result).toEqual({
        _id: mockUserDocument._id,
        email: mockUserDocument.email,
        userRole: mockUserDocument.userRole,
        userAuthProvider: mockUserDocument.userAuthProvider,
        createdAt: mockUserDocument.createdAt,
        updatedAt: mockUserDocument.updatedAt,
      });
    });
  });
});
