import { Injectable } from '@nestjs/common';
import { map, TerraformGenerator } from 'terraform-generator';
import { simpleProject } from '../../data/simpleProject';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ProjectDto } from './dtos/project.dto';

interface AWSConfig {
  region: string;
  access_key: string;
  secret_key: string;
}

interface TerraformConfig {
  token: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  generateTerraformFile(project: ProjectDto) {
    const awsConfig = this.configService.get<AWSConfig>('aws');

    // Setup Terraform generator
    const tfg = new TerraformGenerator();

    // Setup Cloud Provider
    tfg.provider('aws', {
      region: awsConfig.region,
      access_key: awsConfig.access_key,
      secret_key: awsConfig.secret_key,
    });

    const nodes = project.project.views.deployment.nodes;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getTags = (name: string): Map =>
      map({
        Name: name,
      });

    for (const node in nodes) {
      const current = nodes[node].node_config;
      tfg.resource(`aws_${current.identifier}`, current.name, {
        ami: current.ami,
        instance_type: current.type,
        tags: getTags(current.name),
        key_name: 'archiflow',
      });
    }

    tfg.generate();

    // Write terraform into file
    const outputDir = path.join('output', 'Default');
    tfg.write({ dir: outputDir, format: true });

    return 'TF file was generated!';
  }

  async getOrCreateWorkspace() {
    const terraformConfig =
      this.configService.get<TerraformConfig>('terraform');

    const config = {
      headers: {
        Authorization: `Bearer ${terraformConfig.token}`,
      },
    };

    const url = `https://app.terraform.io/api/v2/organizations/archiflow/workspaces/${simpleProject.project.name}`;

    const { data } = await firstValueFrom(
      this.httpService.get(url, config).pipe(
        catchError((error) => {
          throw `An error happened to the getOrCreateWorkspace request! ${error}`;
        }),
      ),
    );

    if (!data) {
      this.createWorkspace();
    } else {
      return data;
    }
  }

  createWorkspace() {
    const createWorkspaceUrl =
      'https://app.terraform.io/api/v2/organizations/archiflow/workspaces/';

    const workspaceObj = {
      data: {
        attributes: {
          name: simpleProject.project.name,
          'resource-count': 0,
        },
        type: 'workspaces',
      },
    };

    this.httpService.post(createWorkspaceUrl, workspaceObj);
  }
}
