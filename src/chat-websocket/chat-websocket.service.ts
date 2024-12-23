import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatWebsocketService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(chatId: string, userId: string, message: string) {
    return this.prisma.message.create({
      data: {
        chatId,
        userId,
        text: message,
      },
    });
  }
}
