import { Injectable } from '@nestjs/common';
import { SuperBoardDocument } from '../../mongo/schemas/board/super.board.schema';
import { SuperSlideDocument } from '../../mongo/schemas/slide/super.slide.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { SuperObjectDocument } from '../../mongo/schemas/object/super.object.schema';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { ClientBoardInfo } from '../../shared/interfaces/ClientBoardInfo';
import { BoardPermission } from '../../shared/enums/board.permission';
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

  toResponseBoardWithSlideCount(board: ClientBoardInfo): BoardResponseObject {
    const { _id, name, owner, slideCount, permission } = board;
    return {
      _id: _id as string,
      name,
      owner,
      slideCount,
      permission: BoardPermission[permission],
    };
  }

  toResponseBoardWithPopulatedPermissions(
    board: BoardWithPopulatedPermissions,
    permission: BoardPermission,
    sizeInBytes: number,
  ): PopulatedBoardResponseObject {
    const { _id, name, owner, slides, permissions, createdAt, updatedAt } =
      board.toObject<BoardWithPopulatedPermissions>();
    return {
      _id: _id as string,
      name,
      permission: BoardPermission[permission],
      permissions: {
        ...permissions,
      },
      owner,
      slideCount: slides.length,
      sizeInBytes,
      createdAt,
      updatedAt,
    };
  }
}
