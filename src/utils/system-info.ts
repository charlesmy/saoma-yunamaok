/** @format */
import Taro from '@tarojs/taro'

const systemInfo = Taro.getSystemInfoSync()
const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()

// 状态栏高度
export const statusBarHeight = systemInfo.statusBarHeight || 0
// 胶囊高度
export const menuButtonHeight = menuButtonInfo.height
// 胶囊距上边界距离
export const menuButtonTop = menuButtonInfo.top
// 胶囊距右边距离
export const menuButtonRight = menuButtonInfo.right
// 胶囊距左边界距离
export const menuButtonLeft = menuButtonInfo.left
// 导航高度
export const navbarHeight = 44
// 页面状态栏内边距高
export const pagePaddingTop = statusBarHeight + navbarHeight
// 是否在企业微信中
export const isQYApp = systemInfo.environment === 'wxwork'
// 屏幕宽度
export const screenWidth = systemInfo.screenWidth
// 屏幕高度
export const screenHeight = systemInfo.screenHeight
// 像素密度比
export const pixelRatio = systemInfo.pixelRatio
// ios为true安卓为false
export const systemType = systemInfo?.system?.indexOf('iOS') > -1
