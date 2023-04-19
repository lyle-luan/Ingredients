// app.js
App({
  onLaunch() {
    const { statusBarHeight, system, platform } = wx.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect()
    const height = menuButton.bottom + menuButton.top - statusBarHeight * 2
    this.globalData.capsuleHeight = menuButton.top
    console.log('menuButton.bottom: ' + menuButton.bottom)
    console.log('menuButton.top: ' + menuButton.top)
    console.log('statusBarHeight: ' + statusBarHeight)
  },
  globalData: {
    capsuleHeight: 0
  }
})
