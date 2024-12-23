import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatWebsocketService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(chatId: string, userId: string, message: string) {
    const chatExists = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      throw new Error(`Chat with ID ${chatId} does not exist.`);
    }

    return this.prisma.message.create({
      data: {
        chatId,
        userId,
        text: message,
      },
    });
  }
}
