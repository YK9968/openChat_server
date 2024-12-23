import {
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatWebsocketService } from './chat-websocket.service';

@WebSocketGateway()
export class ChatWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatWebsocketService: ChatWebsocketService) {}

  afterInit() {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { chatId: string; userId: string; message: string },
  ) {
    const { chatId, userId, message } = data;

    await this.chatWebsocketService.saveMessage(chatId, userId, message);

    this.server.to(chatId).emit('new_message', { userId, message });

    return { status: 'Message sent successfully' };
  }
}
