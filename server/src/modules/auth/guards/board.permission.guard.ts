import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { BoardPermission } from '../../../enums/board.permission';
import { GwSocketWithTarget } from '../../../shared/interfaces/auth/GwSocket';
import { MINIMUM_BOARD_PERMISSION_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class BoardPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const client: GwSocketWithTarget = context.switchToWs().getClient();
    const user = client.data.user;

    if (
      !user ||
      !user.availableBoards ||
      !user.targetBoard ||
      !user.targetSlide
    ) {
      throw new WsException('Try to reconnect');
    }

    const minimumPermission = this.getMinimumPermission(context);
    if (minimumPermission === undefined) return true;
    return this.validatePermission(client, minimumPermission);
  }

  private getMinimumPermission(
    context: ExecutionContext,
  ): BoardPermission | undefined {
    return this.reflector.get<BoardPermission>(
      MINIMUM_BOARD_PERMISSION_KEY,
      context.getHandler(),
    );
  }

  private validatePermission(
    client: GwSocketWithTarget,
    requiredPermission: BoardPermission,
  ): boolean {
    const userBoardPermission = client.data.user.targetBoard.permission;
    if (userBoardPermission < requiredPermission) {
      client.emit('error', {
        message: `You need at least ${BoardPermission[requiredPermission]} permission to perform this action`,
      });
      client.disconnect(true);
      return false;
    }
    return true;
  }
}
