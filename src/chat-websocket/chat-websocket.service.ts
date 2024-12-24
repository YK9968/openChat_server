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

  async updateMessage(messageId: string, newMessage: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { text: newMessage },
    });
  }

  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
