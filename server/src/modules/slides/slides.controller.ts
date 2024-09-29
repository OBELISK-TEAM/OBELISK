import { Controller, Get, Param, Query } from '@nestjs/common';
import { SlidesService } from './slides.service';

@Controller()
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}
}
