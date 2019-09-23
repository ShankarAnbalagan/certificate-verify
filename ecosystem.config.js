module.exports = {
  apps : [{
    name: 'verify',
    script: 'bin/www',
    instances: "max",
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};