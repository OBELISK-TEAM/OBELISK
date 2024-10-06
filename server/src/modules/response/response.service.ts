import { Injectable } from '@nestjs/common';
import { SuperBoardDocument } from '../../schemas/board/super.board.schema';
import { SuperSlideDocument } from '../../schemas/slide/super.slide.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { SuperObjectDocument } from '../../schemas/object/super.object.schema';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { BoardPermissions } from 'src/shared/interfaces/BoardPermissions';
import { BoardPermission } from 'src/enums/board.permission';
import { Types } from 'mongoose';
import { UserRelatedBoardsPaginatedResponseObject } from 'src/shared/interfaces/response-objects/UserRelatedBoardsPaginatedResponseObject';
import { UserRelatedBoardResponseObject } from 'src/shared/interfaces/response-objects/UserRelatedBoardResponseObject';

@Injectable()
export class ResponseService {
  constructor() {}

  toResponseBoard(board: SuperBoardDocument): BoardResponseObject {
    const { _id, name, owner, permissions, slides } =
      board.toObject<SuperBoardDocument>();

    const newSlides = slides.map(slide => slide._id as string);

    return {
      _id: _id as string,
      name,
      owner,
      permissions,
      slides: newSlides,
    };
  }

  toResponseUserRelatedBoard(
    board: SuperBoardDocument,
    userId: string,
  ): UserRelatedBoardResponseObject {
    const { _id, name, owner, permissions, slides, createdAt, updatedAt } =
      board.toObject<SuperBoardDocument>();

    const newSlides = slides.map(slide => slide._id as string);
    const currentUserPermission = this.getCurrentUserPermission(
      permissions,
      userId,
    );
    const size = this.getBoardSize();

    return {
      _id: _id as string,
      name,
      owner,
      permissions,
      slides: newSlides,
      createdAt,
      updatedAt,
      currentUserPermission: BoardPermission[currentUserPermission],
      size,
    };
  }

  toResponseUserRelatedBoardsPaginated(
    boards: SuperBoardDocument[],
    userId: string,
    currentPage: number,
    limit: number,
    totalPages: number,
  ): UserRelatedBoardsPaginatedResponseObject {
    const boardsResponse = boards.map(board =>
      this.toResponseUserRelatedBoard(board, userId),
    );

    return {
      boardsPaginated: boardsResponse,
      currentPage,
      limit: limit,
      totalPages,
    };
  }

  toResponseSlide(slide: SuperSlideDocument): SlideResponseObject {
    const { _id, objects, version } = slide as SuperSlideDocument;
    return {
      _id: _id as string,
      version,
      objects: objects.map(obj => this.toResponseObject(obj)),
    };
  }

  toResponseObject(object: SuperObjectDocument): ObjectResponseObject {
    const { _id, createdAt, updatedAt, ...props } =
      object.toObject<SuperObjectDocument>();
    return {
      _id: _id as string,
      ...props,
    };
  }

  private getCurrentUserPermission(
    permissions: BoardPermissions,
    userId: string,
  ): BoardPermission {
    const userObjectId = new Types.ObjectId(userId);

    const editorSet = new Set(permissions.editor.map(id => id.toString()));
    const viewerSet = new Set(permissions.viewer.map(id => id.toString()));
    const moderatorSet = new Set(
      permissions.moderator.map(id => id.toString()),
    );

    if (editorSet.has(userObjectId.toString())) {
      return BoardPermission.EDITOR;
    } else if (viewerSet.has(userObjectId.toString())) {
      return BoardPermission.VIEWER;
    } else if (moderatorSet.has(userObjectId.toString())) {
      return BoardPermission.MODERATOR;
    }

    return BoardPermission.OWNER;
  }

  private getBoardSize(): number {
    // TODO - implement
    return 1;
  }
}
