import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dtos/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Post()
  generateTerraformFile(@Body() projectDto: ProjectDto) {
    return this.projectService.generateTerraformFile(projectDto);
  }

  @Get('/workspace')
  getOrCreateWorkspace() {
    return this.projectService.getOrCreateWorkspace();
  }
}
