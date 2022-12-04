interface IProject {
  name: string;
  views: IView;
  project_config: object;
}

interface IView {
  functional: IFunctionalView;
  deployment: IDeploymentView;
}

interface IDeploymentView {
  nodes: INode[];
}

interface IFunctionalView {
  services: string[];
}

interface INode {
  services: object[];
  node_config: NodeConfig;
}

interface NodeConfig {
  identifier: string;
  name: string;
  ami: string;
  type: string;
}

export class ProjectDto {
  project: IProject;
}
