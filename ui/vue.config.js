const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: path.resolve(__dirname, '../api/public/')
  // devServer: {
  //   proxy: 'http://localhost:3000'
  // }
})
