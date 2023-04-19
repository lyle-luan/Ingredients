Page({
  data: {
    capsuleHeight: 0,
    imgSrc: '',
    x: -1,
    y: -1
  },

  onLoad: function(option) {
    const app = getApp()
    const height = app.globalData.capsuleHeight
    this.setData ({
      ingredientImgPath: option.imgPath,
      capsuleHeight: height,
      imgSrc: option.imgPath
    })
  },

  takePhoto: function() {
    console.log('take photo')
  },

  downBack: function() {
    console.log('downBack')
  }
})
