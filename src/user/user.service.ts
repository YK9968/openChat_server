import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterUserDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async createUser(dto: RegisterUserDto): Promise<User> {
    const SALT = 10;
    const hasPassword = await bcrypt.hash(dto.password, SALT);

    const user = await this.prisma.user.create({
      data: { ...dto, password: hasPassword },
    });

    return user;
  }

  async findUsersByPhoneNumber(phone: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        phone: {
          contains: phone,
        },
      },
    });

    return users;
  }
}
