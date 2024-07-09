import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide } from '../../schemas/slide.schema';
import { CreateSlideDto } from './slides.dto';

@Injectable()
export class SlidesService {
  constructor(@InjectModel(Slide.name) private slideModel: Model<Slide>) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const createdSlide = new this.slideModel(createSlideDto);
    return createdSlide.save();
  }
}
