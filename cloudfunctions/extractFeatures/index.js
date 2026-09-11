const cloud = require('wx-server-sdk')
const Jimp = require('jimp')

cloud.init()

exports.main = async (event) => {
  try {
    const { fileID } = event
    const file = await cloud.downloadFile({ fileID })

    // 转换为 JPG
    let image = await Jimp.read(file.fileContent)
    image = image.quality(85).rgba(false) 
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG) 

    const jpgImage = await Jimp.read(buffer)

    // 计算特征
    const features = {
      color: getDominantColor(jpgImage),
      histogram: getSampledHistogram(jpgImage),
      contours: getContours(jpgImage),
      pHash: await getPhash(jpgImage)
    }

    return { success: true, features }

  } catch (err) {
    return {
      success: false,
      error: `处理失败: ${err.message}`,
      features: { 
        color: '#000000',
        histogram: { r: [], g: [], b: [] },
        contours: 0,
        pHash: ''
      }
    }
  }
}

// ================== 工具函数 ==================

// 取图片主色
const getDominantColor = (image) => {
  const pixel = image.getPixelColor(10, 10)
  return `#${pixel.toString(16).padStart(8, '0').slice(2, 8)}`
}

// 生成简化直方图
const getSampledHistogram = (image) => {
  const hist = { r: [], g: [], b: [] }
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (x % 10 === 0 && y % 10 === 0) {
      hist.r.push(image.bitmap.data[idx])
      hist.g.push(image.bitmap.data[idx + 1])
      hist.b.push(image.bitmap.data[idx + 2])
    }
  })
  return { 
    r: sampleArray(hist.r, 2),
    g: sampleArray(hist.g, 2),
    b: sampleArray(hist.b, 2)
  }
}

// 计算轮廓复杂度
const getContours = async (imagePath) => {
  image.gaussian(2)
  const image = await Jimp.read(imagePath)
  const width = image.bitmap.width
  const height = image.bitmap.height
  const data = image.bitmap.data
  let edgeCount = 0

  const getPixel = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return 0
    return data[(width * y + x) * 4]
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const gx =
        -1 * getPixel(x - 1, y - 1) + 1 * getPixel(x + 1, y - 1) +
        -2 * getPixel(x - 1, y)     + 2 * getPixel(x + 1, y) +
        -1 * getPixel(x - 1, y + 1) + 1 * getPixel(x + 1, y + 1)

      const gy =
        -1 * getPixel(x - 1, y - 1) - 2 * getPixel(x, y - 1) - 1 * getPixel(x + 1, y - 1) +
         1 * getPixel(x - 1, y + 1) + 2 * getPixel(x, y + 1) + 1 * getPixel(x + 1, y + 1)

      const gradient = Math.sqrt(gx * gx + gy * gy)
      if (gradient > 50) edgeCount++
    }
  }

  const totalPixels = width * height
  const complexity = edgeCount / totalPixels // 归一化复杂度
  return parseFloat(complexity.toFixed(4))
}

// 计算感知哈希
const getPhash = async (image) => {
  const size = 8
  const resized = image.clone().resize(size, size).greyscale()
  let sum = 0, hash = ''

  resized.scan(0, 0, size, size, (x, y, idx) => {
    sum += resized.bitmap.data[idx]
  })
  const avg = sum / (size * size)

  resized.scan(0, 0, size, size, (x, y, idx) => {
    hash += resized.bitmap.data[idx] > avg ? '1' : '0'
  })

  return hash
}

// 采样工具函数
const sampleArray = (arr, step = 5) => {
  return arr.filter((_, i) => i % step === 0)
}
