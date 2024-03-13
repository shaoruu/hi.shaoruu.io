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
      out_file: './logs/core-app-out.log', // Standard output log
      error_file: './logs/core-app-error.log', // Error log
      merge_logs: true, // Merge logs if you want a single file for both out and error logs
      log_date_format: 'YYYY-MM-DD HH:mm Z', // Log date format
    },
  ],
};
