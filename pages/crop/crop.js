
import WeCropper from '../../component/we-cropper/we-cropper.js'

const app = getApp()
const config = app.globalData.config

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 80

Page({
  data: {
    capsuleHeight: 0,
    imgSrc: '',
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 0.06 * width,
        y: 0.3 * height,
        width: 0.88 * width,
        height: 0.88 * width * 12 / 17
      },
      boundStyle: {
        color: 'rgb(27, 184, 77)',
        mask: 'rgba(0,0,0,0.3)',
        lineWidth: 3
      }
    }
  },

  onLoad: function(option) {
    const app = getApp()
    const height = app.globalData.capsuleHeight
    this.setData ({
      ingredientImgPath: option.imgPath,
      capsuleHeight: height,
      imgSrc: option.imgPath
    })

    const { cropperOpt } = this.data

    this.setData({ cropperOpt })

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })

      this.cropper.pushOrign(this.data.imgSrc)

  },

  takePhoto: function() {
    console.log('take photo')
  },

  downBack: function() {
    console.log('downBack')
  },

  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage () {
    this.cropper.getCropperImage()
      .then((src) => {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
      })
      .catch((err) => {
        wx.showModal({
          title: '温馨提示',
          content: err.message
        })
      })
  }
})
