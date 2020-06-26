module.exports = {
  apps : [{
    name: 'nodejs-modular-monolith',
    script: './src/app.js',
    // run 8 process and pm2 will load balance the trafic
    instances: 8,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],
};
