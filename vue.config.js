module.exports = {
  pages: {
    index: {
      entry: 'src/renderer/index.ts'
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.js',
      preload: 'src/main/preload.js'
    }
  }
}
