import { FilterQuery } from 'mongoose';
import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export class FilterQueryBuilder {
  private query: FilterQuery<SuperBoardDocument> = {};

  constructor() {}

  ownedBy(userId: string): this {
    this.query.owner = userId;
    return this;
  }

  private getSharedPermissions(userId: string) {
    return [
      { 'permissions.viewer': userId },
      { 'permissions.editor': userId },
      { 'permissions.moderator': userId },
    ];
  }

  sharedWith(userId: string): this {
    this.query.$or = this.getSharedPermissions(userId);
    return this;
  }

  accessibleTo(userId: string): this {
    this.query.$or = [{ owner: userId }, ...this.getSharedPermissions(userId)];
    return this;
  }

  build(): FilterQuery<SuperBoardDocument> {
    return this.query;
  }
}
