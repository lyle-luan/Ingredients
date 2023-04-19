Page({
  data: {
    capsuleHeight: 0,
    cameraContext: null,
    cameraFlash: 'off',
    takePictureCanvasContext: null,
    takePictureCanvasWidth: 0,
    takePictureCanvasHeight: 0,
    takePhotoTapped: false,
    choosePhotoTapped: false,
    downTapped: false,
    flashTapped: false,
    flashImgSrc: '/res/flashoff.png',
    uid: ''
  },

  onLoad: function() {
    const app = getApp()
    const height = app.globalData.capsuleHeight
    this.setData ({
      capsuleHeight: height
    })
    function loginFailed(res) {
      wx.showModal({
        title: '登录失败',
        content: '请重新登录',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F'
      })
    }

    function login(code, uid) {
      wx.showLoading({
        title: '登录中...',
      })
      wx.request({
        url: 'https://newtype.top/api/login',
        // url: 'http://127.0.0.1:8888/api/login',
        data: {
          code: code,
          key: uid
        },
        timeout: 1500,
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          try {
            const result = res.data
            const errcode = result['errcode']
            if (errcode != 0) {
              console.error('success but errcode: ' + result);
              loginFailed(res)
              return;
            }
            const uid = result['uid']
            if (!uid && typeof(uid)!="undefined" && uid!=0) {
              console.error('success but uid is null: ' + JSON.stringify(result));
            } else {
              console.log('login store uid: ' + uid);
              this.setData({
                uid: uid
              })
              wx.setStorageSync('key', uid)
            }
          } catch (e) {
            console.error('success but excaption111' + e);
            loginFailed(res)
          }
        },
        fail: (res) => {
          console.error('fail: ' + res);
          wx.hideLoading()
          loginFailed(res)
        }
      })
    }

    const uid = wx.getStorageSync('key')
    if (uid) {
      this.setData({
        uid: uid
      })
    } else {
      wx.login({
        success: (res) => {
          if (res.code) {
            login(res.code, '')
          } else {
            loginFailed(res)
          }
        },
        fail: (res) => {
          loginFailed(res)
        },
        timeout: (res) => {
          loginFailed(res)
        }
      })
    }
  },

  onReady: function() {
    this.setData({
      cameraContext: wx.createCameraContext(),
      takePictureCanvasContext: wx.createCanvasContext('takePictureCanvas', this)
    })
  },

  takePhoto: function() {
    this.setData ({
      takePhotoTapped: true
    })
    setTimeout(() => this.setData({ takePhotoTapped: false }), 200)
    this.data.cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        const imgPath = res.tempImagePath
        wx.navigateTo({
          url: '/pages/ocr/ocr?imgPath=' + imgPath + '&uid=' + this.data.uid
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  },

  changeFlash: function () {
    const flash = this.data.cameraFlash
    this.setData ({
      cameraFlash: flash == 'on' ? 'off' : 'on',
      flashImgSrc: flash == 'on' ? 
      '/res/flashoff.png' : '/res/flashon.png',
      flashTapped: true
    })
    setTimeout(() => this.setData({ flashTapped: false }), 200)
  },

  choosePhoto: function() {
    this.setData ({
      choosePhotoTapped: true
    })
    setTimeout(() => this.setData({ choosePhotoTapped: false }), 200)
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success(res) {
        if (res.tempFiles.length == 1) {
          const imgPath = res.tempFiles[0].tempFilePath
          wx.navigateTo({
            url: '/pages/crop/crop?imgPath=' + imgPath
          })
        } else {
          console.error('wx api error, wx chooseMeida no tempFiles: ' + res.tempFiles.count)
        }
      },
      fail(res) {
        console.error('wx api error, wx chooseMeida')
      }
    })
  },

  downBack: function() {
    this.setData ({
      downTapped: true
    })
    setTimeout(() => this.setData({ downTapped: false }), 200)
  },

  onCameraStop: function() {
    //TODO:
    const cameraContext = this.data.cameraContext
    const takePictureCanvasContext = this.data.takePictureCanvasContext
    const takePictureCanvasWidth = this.data.takePictureCanvasWidth
    const takePictureCanvasHeight = this.data.takePictureCanvasHeight

    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        takePictureCanvasContext.drawImage(res.tempImagePath, 0, 0, takePictureCanvasWidth, takePictureCanvasHeight)
        takePictureCanvasContext.draw()
      },
      fail: (res) => {
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  },

  onCameraError: function(e) {
  },

  onCameraInitDone: function(e) {
    const { width, height } = e.detail
    this.setData({
      takePictureCanvasWidth: width,
      takePictureCanvasHeight: height
    })
  },

  onTakePictureCanvasLoad: function(e) {
    const takePictureCanvasContext = this.data.takePictureCanvasContext
    takePictureCanvasContext.setStrokeStyle('red')
    takePictureCanvasContext.setLineWidth(2)
    takePictureCanvasContext.rect(10, 10, 100, 100)
    takePictureCanvasContext.stroke()
    takePictureCanvasContext.draw()
  }
})
