import { Body, Controller, Post } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './slides.dto';

@Controller('slides')
export class SlidesController {
  constructor(private slidesService: SlidesService) {}

  @Post()
  create(@Body() createSlideDto: CreateSlideDto) {
    console.log(createSlideDto);
    return createSlideDto;
    // return this.slidesService.create(createSlideDto);
  }
}
