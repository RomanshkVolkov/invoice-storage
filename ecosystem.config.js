module.exports = {
  apps: [
    {
      name: "invoice-storage",
      script: "./node_modules/next/dist/bin/next",
      args: "build && start -p " + (process.env.PORT || 3000),
      watch: false,
      autorestart: true,
    },
  ],
};
