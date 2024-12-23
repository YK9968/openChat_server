import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessages(dto: CreateMessageDto): Promise<Message> {
    const data = await this.prisma.message.create({ data: { ...dto } });
    return data;
  }

  async getMessages(id: string): Promise<Message[]> {
    const data = await this.prisma.message.findMany({ where: { chatId: id } });
    return data;
  }

  async findMessagesById(id: string): Promise<Message> {
    const data = await this.prisma.message.findUnique({
      where: { id },
    });

    return data;
  }

  async updateMessages(dto: CreateMessageDto, id: string): Promise<Message> {
    const message = await this.prisma.message.update({
      where: { id, chatId: dto.chatId, userId: dto.userId },
      data: { text: dto.text },
    });

    return message;
  }

  async deleteMessage(dto: CreateMessageDto, id: string): Promise<void> {
    await this.prisma.message.delete({
      where: { id, chatId: dto.chatId, userId: dto.userId },
    });
  }
}
