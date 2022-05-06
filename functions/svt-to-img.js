const { svg2png } = require('svg-png-converter')
const nodeHtmlToImage = require('node-html-to-image')
module.exports= {
    svgtoimg: async (string) =>{
    let outputBuffer = await svg2png({
                input: string,
                encoding: 'buffer',
                format: 'png',
                quality: 1
            })
        return outputBuffer;
    },
    htmltoimg: async (string) =>{
        const images = await nodeHtmlToImage({
            html: string,
            quality: 100,
            type: 'jpeg',
            puppeteerArgs: {
              args: ['--no-sandbox'],
            },
            encoding: 'buffer',
          })
          return images
    }
}