import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { Role, User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  let mockList: User[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    mockList = [
      {
        auth_id: '1',
        email: 'user1@email.com',
        password: 'password',
        role: Role.USER,
        updatedAt: new Date(),
      },
      {
        auth_id: '2',
        email: 'user2@email.com',
        password: 'password',
        role: Role.USER,
        updatedAt: new Date(),
      },
      {
        auth_id: '3',
        email: 'admin@email.com',
        password: 'password',
        role: Role.ADMIN,
        updatedAt: new Date(),
      },
    ];

    mockList.forEach(async (user) => {
      user.password = await service.hashPassword(user.password);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByEmail', () => {
    const findUniqueMock = jest.fn().mockImplementation((args) => {
      const { where } = args;
      const user = mockList.find((user) => user.email === where.email);

      if (user) {
        return user;
      }
      return null;
    });

    it('should find nothing', async () => {
      prismaService.user.findUnique = findUniqueMock;

      const email = 'not_exist@email.com';

      const result = await service.findUserByEmail(email);
      expect(result).toBeNull();
    });

    it('should find user1', async () => {
      prismaService.user.findUnique = findUniqueMock;

      const email = mockList[0].email;

      const result = await service.findUserByEmail(email);
      expect(result).toEqual(mockList[0]);
    });
  });
});
