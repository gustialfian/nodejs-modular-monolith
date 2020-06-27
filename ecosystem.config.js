module.exports = {
  apps : [{
    name: 'nodejs-modular-monolith',
    script: './src/app.js',
    // run multiple process and pm2 will load balance the trafic
    instances: 3,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
  }],
};
