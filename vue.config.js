const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "frontend/dist",
  publicPath: "/",
  productionSourceMap: false,
});
