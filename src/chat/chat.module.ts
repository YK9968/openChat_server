import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma.service';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, MessagesService],
})
export class ChatModule {}
