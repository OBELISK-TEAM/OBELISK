import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide } from '../../schemas/slide.schema';
import { CreateSlideDto } from './slides.dto';

@Injectable()
export class SlidesService {
  private readonly limit = 5;
  constructor(@InjectModel(Slide.name) private slideModel: Model<Slide>) {}

  async findAll(page: number = 1): Promise<Slide[]> {
    const skip = (page - 1) * this.limit;
    return this.slideModel.find().skip(skip).limit(this.limit).exec();
  }

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const createdSlide = new this.slideModel(createSlideDto);
    return createdSlide.save();
  }

  async findOne(slideId: string): Promise<Slide> {
    const existingSlide = await this.slideModel.findById(slideId).exec();
    if (!existingSlide) throw new HttpException('Slide not found', 404);
    return existingSlide;
  }

  async update(
    slideId: string,
    createSlideDto: CreateSlideDto,
  ): Promise<Slide> {
    const existingSlide = await this.slideModel
      .findByIdAndUpdate(slideId, createSlideDto, { new: true })
      .exec();
    if (!existingSlide) throw new HttpException('Slide not found', 404);
    return existingSlide;
  }

  async delete(slideId: string): Promise<Slide> {
    const existingSlide = await this.slideModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!existingSlide) throw new HttpException('Slide not found', 404);
    return existingSlide;
  }
}
