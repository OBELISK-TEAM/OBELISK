import { Module } from '@nestjs/common';
import { ObjectStatsService } from './object.stats.service';
import { ObjectStatsController } from './object.stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ObjectStats,
  ObjectStatsSchema,
} from 'src/mongo/schemas/stats/object.stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ObjectStats.name,
        schema: ObjectStatsSchema,
      },
    ]),
  ],
  controllers: [ObjectStatsController],
  providers: [ObjectStatsService],
})
export class ObjectStatsModule {}
