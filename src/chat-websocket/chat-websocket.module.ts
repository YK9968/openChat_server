import { Module } from '@nestjs/common';
import { ChatWebsocketService } from './chat-websocket.service';
import { ChatWebsocketGateway } from './chat-websocket.gateway';

@Module({
  providers: [ChatWebsocketService, ChatWebsocketGateway],
})
export class ChatWebsocketModule {}
