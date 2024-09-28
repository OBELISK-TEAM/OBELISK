import { Controller, Param, Post } from '@nestjs/common';
import { SlidesService } from './slides.service';
// import { CreateSlideDto } from './slides.dto';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // TODO - add proper role decorator for endpoints that should not be exposed
  // for example this one
  // @Get()
  // async getSlides(@Query('page') page: number): Promise<SlideResponseObject[]> {
  //   return this.slidesService.getSlides(page);
  // }

  // @Get(':id')
  // async getSlideById(
  //   @Param('id') slideId: string,
  // ): Promise<SlideResponseObject> {
  //   return this.slidesService.getSlideById(slideId);
  // }

  @Post()
  // @UseGuards(JwtAuthGuard)
  createSlide(
    @Param('boardId') boardId: string,
    // @User('_id') userId: string,
    // @Body() createSlideDto: CreateSlideDto,
  ): Promise<SlideResponseObject> {
    return this.slidesService.createSlide(boardId);
  }

  // @Delete(':id')
  // async deleteSlide(@Param('id') slideId: string): Promise<any> {
  //   return this.slidesService.deleteSlideById(slideId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async deleteSlide(
  //   @User('_id') userId: string,
  //   @Param('id') slideId: string,
  // ): Promise<SlideResponseObject> {
  //   return this.slidesService.deleteSlide(userId, slideId);
  // }
}
