Page({
  data: {
    capsuleHeight: 0,
    ingredientImgPath: '',
    conclusion: '识别中...',
    uid: ''
  },

  onLoad: function(option){
    const app = getApp()
    const height = app.globalData.capsuleHeight
    this.setData ({
      ingredientImgPath: option.imgPath,
      uid: option.uid,
      capsuleHeight: height
    })
    this.checkUsage(this.data.ingredientImgPath)
  },

  naviBack: function() {
    wx.navigateBack({})
  },

  checkUsage: function(filePath) {
    function usageFailed(res) {
      wx.showModal({
        title: '识别失败',
        content: '可能需要稍等一下再试一次',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F'
      })
    }

    wx.showLoading({
      title: '检查中...',
    })
    const uid = this.data.uid
    wx.request({
      url: 'https://newtype.top/api/usage',
      // url: 'http://127.0.0.1:8888/api/usage',
      data: {
        uid: uid
      },
      timeout: 1000 * 6,
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        try {
          const result = res.data
          const errcode = result['errcode']
          if (errcode != 0) {
            console.error('usage success but errcode: ' + result);
            usageFailed(res)
            return;
          }
          const usage = result['usage']
          if (!usage && typeof(usage)!="undefined") {
            console.error('usage success but usage is null: ' + JSON.stringify(result));
          } else {
            console.log('usage: ' + usage);
            if (usage <= 0) {
              wx.showToast({
                title: '没有次数了',
                icon: 'none'
              })
            } else {
              console.log('usage: ' + usage + 'ready to upload img');
              this.doOcr(filePath)
            }
          }
        } catch (e) {
          console.error('usage success but excaption' + e);
          usageFailed(res)
        }
      },
      fail: (res) => {
        console.error('usage fail: ' + JSON.stringify(res));
        wx.hideLoading()
        usageFailed(res)
      }
    })
  },

  doOcr: function(filePath) {
    function processFailure(errcode) {
      wx.showModal({
        title: '操作失败',
        content: '请重新扫描配料表',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F'
      })
      console.error('请重新扫描配料表');
    }
    wx.showLoading({
      title: '识别中...',
    })
    const uid = this.data.uid
    const data = {
      uid: uid
    }
    const jsonData = JSON.stringify(data)
    var that = this; // 保存Page对象的指针
    wx.uploadFile({
      url: 'https://newtype.top/upload',
      // url: 'http://127.0.0.1:8888/upload',
      filePath: filePath,
      name: 'img',
      formData: {
        'data': jsonData
      },
      timeout: 1000 * 60 * 5,
      success: function (res) {
        wx.hideLoading()
        try {
          let result = JSON.parse(res.data)
          let errcode = result['errcode']
          if (errcode != 0) {
            processFailure(errcode)
            return;
          }
          that.setData({
            conclusion: result['ocr']
          })
          console.log(that.data.conclusion)
        } catch (e) {
          console.error(res.data);
          console.error(e);
        }
      },
      fail: function (err) {
        wx.hideLoading()
        try {
          let errcode = err['errcode']
          processFailure(errcode)
          console.error(err);
        } catch (e) {
          console.error(err);
          console.error(e);
        }
      },
      onProgressUpdate: function(res) {
        console.log('上传进度：' + res.progress)
        console.log('已上传大小：' + res.totalBytesSent)
        console.log('总大小：' + res.totalBytesExpectedToSend)
      }
    })
  }
})