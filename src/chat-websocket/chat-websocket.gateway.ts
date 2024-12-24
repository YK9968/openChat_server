import {
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatWebsocketService } from './chat-websocket.service';

@WebSocketGateway({ cors: { origin: '*' } })
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

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.chatId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { chatId: string; message: string; userId: string },
  ) {
    const { chatId, userId, message } = data;
    const savedMessage = await this.chatWebsocketService.saveMessage(
      chatId,
      userId,
      message,
    );
    this.server.to(chatId).emit('new_message', {
      userId,
      message,
      chatId,
      createdAt: savedMessage.createdAt,
      id: savedMessage.id,
    });
    return { status: 'Message sent successfully' };
  }
}
