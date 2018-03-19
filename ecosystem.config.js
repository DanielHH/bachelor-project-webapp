module.exports = {
  apps: [
    // First application
    {
      name: 'App',
      script: 'src/main.ts',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'gitlab',
      host: 'localhost',
      ref: 'origin/dev',
      repo: 'git@gitlab.ida.liu.se:pum-ninjas/PUMApp.git',
      path: '/home/gitlab/pumapp',
      'post-deploy': 'npm install && ng build -prod && pm2 reload ecosystem.config.js --env production'
    }
  }
};