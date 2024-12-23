import { Module } from '@nestjs/common';
import { ChatWebsocketService } from './chat-websocket.service';
import { ChatWebsocketGateway } from './chat-websocket.gateway';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ChatWebsocketService, ChatWebsocketGateway, PrismaService],
})
export class ChatWebsocketModule {}
