import { Injectable } from '@nestjs/common';
import { SuperBoardDocument } from '../../schemas/board/super.board.schema';
import { SuperSlideDocument } from '../../schemas/slide/super.slide.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { SuperObjectDocument } from '../../schemas/object/super.object.schema';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { ClientBoardInfo } from '../../shared/interfaces/ClientBoardInfo';
import { BoardPermission } from '../../enums/board.permission';
import { PopulatedBoardResponseObject } from '../../shared/interfaces/response-objects/PaginatedUserBoards';
import { BoardWithPopulatedPermissions } from '../../shared/interfaces/PopulatedBoard';

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

  toResponseSlide(slide: SuperSlideDocument): SlideResponseObject {
    const { _id, objects, version } = slide;
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

  toResponseBoardWithSlidesCount(board: ClientBoardInfo): BoardResponseObject {
    const { _id, name, owner, slidesCount, permission } = board;
    return {
      _id: _id as string,
      name,
      owner,
      slidesCount,
      permission: BoardPermission[permission],
    };
  }

  toResponseBoardWithPopulatedPermissions(
    board: BoardWithPopulatedPermissions,
    permission: BoardPermission,
    sizeInBytes: number,
    showMaxSizeInBytes: boolean,
    showSlideCount: boolean,
  ): PopulatedBoardResponseObject {
    const maxSizeInBytes = 4206969;
    const { _id, name, owner, permissions, createdAt, updatedAt, slides } =
      board.toObject<BoardWithPopulatedPermissions>();

    const response: PopulatedBoardResponseObject = {
      _id: _id as string,
      name,
      owner,
      permission: BoardPermission[permission],
      permissions,
      sizeInBytes,
      createdAt,
      updatedAt,
    };

    if (showMaxSizeInBytes) response.maxSizeInBytes = maxSizeInBytes;
    if (showSlideCount) response.slidesCount = slides.length;
    return response;
  }
}
