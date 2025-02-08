const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",
  outputDir: "dist",
  devServer: {
    port: 8080,
  },
  chainWebpack: (config) => {
    config.module
      .rule("glb")
      .test(/\.glb$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/models/[name].[hash:8].[ext]",
      })
      .end();
  },
});
