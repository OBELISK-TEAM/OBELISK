import { Injectable } from '@nestjs/common';
import { SuperBoardDocument } from '../../schemas/board/super.board.schema';
import { SuperSlideDocument } from '../../schemas/slide/super.slide.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { SuperObjectDocument } from '../../schemas/object/super.object.schema';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { ClientBoardInfo } from '../../shared/interfaces/ClientBoardInfo';
import { BoardPermission } from '../../enums/board.permission';

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

  toResponseClientBoardInfo(board: ClientBoardInfo): BoardResponseObject {
    const { _id, name, owner, slidesCount, permission } = board;
    return {
      _id: _id as string,
      name,
      owner,
      slidesCount,
      permission: BoardPermission[permission],
    };
  }
}
