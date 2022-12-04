export const simpleProject = {
  project: {
    name: 'ProjectA',
    views: {
      functional: {
        services: ['ServiceA'],
      },
      deployment: {
        nodes: [
          {
            services: [
              {
                name: 'ServiceA',
                service_config: {
                  health_check_endpoint: '/health-check',
                  repository: 'express_app',
                  build_command: 'node server.js',
                  environment_variables: [],
                },
              },
            ],
            node_config: {
              identifier: 'instance',
              name: 'InstanceA',
              ami: 'ami-052efd3df9dad4825',
              type: 't2.micro',
            },
          },
        ],
      },
    },
    project_config: {
      AWS_Access_Key: '',
      AWS_Secret_Access_Key: '',
      Github_SSH_Key: '',
    },
  },
};
