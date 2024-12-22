import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat } from '@prisma/client';
import { AppErrors } from 'src/errors';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(user1: string, user2: string): Promise<Chat> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: [user1, user2],
        },
      },
    });

    if (users.length !== 2) {
      throw new BadRequestException(AppErrors.USER_NOT_FOUND);
    }

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { userId1: user1, userId2: user2 },
          { userId1: user2, userId2: user1 },
        ],
      },
    });

    if (existingChat) {
      return existingChat;
    }

    const newChat = await this.prisma.chat.create({
      data: {
        userId1: user1,
        userId2: user2,
      },
    });

    return newChat;
  }

  async findUserChats(userId: string): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
      },
      include: {
        user1: true,
        user2: true,
      },
    });

    return chats;
  }
}
