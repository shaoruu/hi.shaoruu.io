// eslint-disable-next-line
module.exports = {
  apps: [
    {
      name: 'core-app',
      script: '/bin/bash',
      args: '-c "cd core && RUST_BACKTRACE=full cargo run --release"',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
