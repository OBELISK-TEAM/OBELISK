import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoardPermission } from '../../../shared/enums/board.permission';
import { GwSocketWithTarget } from '../../../shared/interfaces/auth/GwSocket';
import { MINIMUM_BOARD_PERMISSION_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class BoardPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const client: GwSocketWithTarget = context.switchToWs().getClient();
    const user = client.data.user;

    if (!user || !user.targetBoard || !user.targetSlide) {
      this.emitErrorAndDisconnect(client, 'You need to join a board first');
      return false;
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
      const permissionString = BoardPermission[requiredPermission];
      this.emitErrorAndDisconnect(
        client,
        `Invalid permission, at least ${permissionString} permission is required`,
      );
      return false;
    }
    return true;
  }

  private emitErrorAndDisconnect(
    client: GwSocketWithTarget,
    message: string,
  ): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
