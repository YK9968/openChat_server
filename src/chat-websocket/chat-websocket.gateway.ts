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

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @MessageBody() data: { messageId: string; newMessage: string },
    @ConnectedSocket() client: Socket,
  ) {
    const updatedMessage = await this.chatWebsocketService.updateMessage(
      data.messageId,
      data.newMessage,
    );
    this.server.to(client.id).emit('message_updated', {
      userId: updatedMessage.userId,
      text: updatedMessage.text,
      chatId: updatedMessage.chatId,
      createdAt: updatedMessage.createdAt,
      id: updatedMessage.id,
    });
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatWebsocketService.deleteMessage(data.messageId);
    this.server.to(client.id).emit('message_deleted', data.messageId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { chatId: string; text: string; userId: string },
  ) {
    const { chatId, userId, text } = data;
    const savedMessage = await this.chatWebsocketService.saveMessage(
      chatId,
      userId,
      text,
    );
    this.server.to(chatId).emit('new_message', {
      userId,
      text,
      chatId,
      createdAt: savedMessage.createdAt,
      id: savedMessage.id,
    });
    return { status: 'Message sent successfully' };
  }
}
