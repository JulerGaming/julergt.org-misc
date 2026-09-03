module.exports = {
  apps: [
    {
      name: 'julergt-org-misc',
      script: 'index.js',
      cwd: __dirname,
      watch: ['.'],
      ignore_watch: ['node_modules', '.git'],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'julergt-org-misc-service-worker',
      script: './service-worker/index.js',
      cwd: __dirname,
      watch: ['./service-worker'],
      ignore_watch: ['node_modules', '.git'],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      ref: 'origin/master',
      repo: 'https://github.com/JulerGaming/julergt.org-misc.git',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
