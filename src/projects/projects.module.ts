import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [HttpModule],
})
export class ProjectsModule {}
