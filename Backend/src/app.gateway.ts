import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { events } from './common/events/eventEmitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('subscribeToNotifications')
  handleMessage(client: Socket, payload: string): void {
    events.eventOnStart(() => {
      this.server.sockets.emit('notification', 'Syncing');
    });
    events.eventOn(() => {
      this.server.sockets.emit('notification', 'Synced');
      // this.server.sockets.
    });

    events.eventOnFailed(() => {
      this.server.sockets.emit('notification', 'Failed');
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
