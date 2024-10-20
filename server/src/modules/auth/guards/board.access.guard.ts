import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoardPermission } from '../../../shared/enums/board.permission';
import { GwSocketWithTarget } from '../../../shared/interfaces/auth/GwSocket';
import { MINIMUM_BOARD_PERMISSION_KEY } from '../decorators/permissions.decorator';
import { Request } from 'express';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';
import { BoardsService } from '../../boards/boards.service';

// WS:
// @UseGuards(BoardAccessGuard)
// @MinimumBoardPermission(BoardPermission.VIEWER)

// HTTP REST (needs to be used with JwtAuthGuard):
// @UseGuards(JwtAuthGuard, BoardAccessGuard)
// @MinimumBoardPermission(BoardPermission.VIEWER)

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const minimumPermission = this.getMinimumPermission(context);
    if (minimumPermission === undefined) return true;

    const type = context.getType<'ws' | 'http'>();
    switch (type) {
      case 'http':
        return this.handleHttp(context, minimumPermission);
      case 'ws':
        return this.handleWs(context, minimumPermission);
      default:
        return false;
    }
  }

  private async handleHttp(
    context: ExecutionContext,
    minimumBoardPermission: BoardPermission,
  ): Promise<boolean> {
    const { user, boardId } = this.extractHttpData(context);
    return boardId && user
      ? this.validateHttpPermission(user, boardId, minimumBoardPermission)
      : false;
  }

  private extractHttpData(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return {
      user: request.user as SafeUserDoc,
      boardId: request.params.boardId,
    };
  }

  private async validateHttpPermission(
    user: SafeUserDoc,
    boardId: string,
    minimumBoardPermission: BoardPermission,
  ): Promise<boolean> {
    const board = await this.boardsService.findBoardById(boardId);
    const permission = this.boardsService.determineUserPermission(
      board,
      user._id as string,
    );
    return permission >= minimumBoardPermission;
  }

  private handleWs(
    context: ExecutionContext,
    minimumPermission: BoardPermission,
  ): boolean {
    const client = this.extractWsClient(context);
    const user = client.data.user;
    if (!user || !user.targetBoard || !user.targetSlide) {
      this.emitErrorAndDisconnect(client, 'You need to join a board first');
      return false;
    }
    return this.validateWsPermission(client, minimumPermission);
  }

  private extractWsClient(context: ExecutionContext): GwSocketWithTarget {
    return context.switchToWs().getClient<GwSocketWithTarget>();
  }

  private validateWsPermission(
    client: GwSocketWithTarget,
    minimumBoardPermission: BoardPermission,
  ): boolean {
    const userBoardPermission = client.data.user.targetBoard.permission;
    if (userBoardPermission < minimumBoardPermission) {
      const permissionString = BoardPermission[minimumBoardPermission];
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

  private getMinimumPermission(
    context: ExecutionContext,
  ): BoardPermission | undefined {
    return this.reflector.get<BoardPermission>(
      MINIMUM_BOARD_PERMISSION_KEY,
      context.getHandler(),
    );
  }
}
