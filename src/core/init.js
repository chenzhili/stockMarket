import { isObject, isString, isFunction, browserRedirect, getDecimalValue } from '../utils'
import { insType, Theme, calcConfig } from '../enums'

import { initTimeSharingDiagram, paintTimeSharingDiagram } from './timeSharingDiagram'
import { initkLineGraph, kLineGraphPaint } from './kLineGraph'

export default function initCanvas (QLStockMarket) {
  QLStockMarket.prototype.init = function (options) {
    const QL = this
    // console.log(1111);
    if (!isObject(options)) return '数据格式不对'

    const { selector, data, config, emit } = options

    // 在 initData 中 进行初始化
    // // 测试 es6的import 的数据是 共享还是 只是值 ,获取到的 结果是可以 对于 修改的值 进行共享；
    // // 初始化外部的配置项
    // if (config.insType === insType.kLineGraph) {
    //     calcConfig.kLineGraph = config;
    // }

    if (isObject(emit)) {
      /* 这里要注意私有方法 和 共有方法 的区别 */
      // 这种写法 有问题，这种放到 原型链上 共享 是有 问题的，特别注意
      // QLStockMarket.prototype.getUpToDataData = emit.getUpToDataData;
      // 解决 办法 应该 是吧 当前 方法 作为 私有方法
      if (isFunction(emit.getUpToDataData)) {
        Object.defineProperty(QL, 'getUpToDataData', {
          get () {
            return emit.getUpToDataData
          }
        })
      }
      /* if (isFunction(emit.refresh)) {
                Object.defineProperty(QL, "refresh", {
                    get () {
                        return emit.refresh;
                    }
                })
            } */
    }

    if (isObject(emit) && isFunction(emit.getChangeData)) {
      // QLStockMarket.prototype.getChangeData = emit.getChangeData;
      // 同上
      Object.defineProperty(QL, 'getChangeData', {
        get () {
          return emit.getChangeData
        }
      })
    }

    if (!selector) return '没有入口文件'
    const DOM = document.querySelector(selector)
    if (!DOM) return '入口node未找到'

    /* 这个获取的 窗口大小，旋转后 width 和 height 对应的 长宽 不一样了 的大小不满足条件了 */
    const { width: actuallyWidth, height: actuallyHeight } = DOM.getBoundingClientRect()
    let { 'border-left-width': leftWidth, 'border-right-width': rightWidth, 'border-top-width': topWidth, 'border-bottom-width': bottomWidth, width, height } = getComputedStyle(DOM)
    width = parseFloat(width)
    height = parseFloat(height)
    const device = browserRedirect()

    // console.log(leftWidth,rightWidth,topWidth,bottomWidth)

    // console.log(DOM, width, height);
    // 一次判断 当前 控制 的 是在 x 还是 y上
    // console.log("盒子元素的 width ",width , "盒子的",actuallyWidth);
    // console.log("盒子元素的 height ",height , "盒子的",actuallyHeight);

    /* 判断当前 盒子是否 发生了 旋转，旋转以后 事件上 需要 传入不同的参数 */
    let rotate = false
    if (Math.ceil(width) !== Math.ceil(actuallyWidth) && Math.ceil(width) === Math.ceil(actuallyHeight)) {
      rotate = true
    }

    dealTheme(QL, config.theme);

    (function (QL) {
      let tempData = null// 临时数据的 存储
      const DOMMess = { // DOM 的 信息存储
        width: width - (parseFloat(leftWidth) + parseFloat(rightWidth)),
        height: height - (parseFloat(topWidth) + parseFloat(bottomWidth))
      }
      if (config.insType === insType.timeSharingDiagram) {
        tempData = data.chartData
      }
      if (config.insType === insType.kLineGraph) {
        tempData = data.kData
      }
      console.log(tempData)
      // 配置只读属性
      Object.defineProperties(QL, {
        // 存储 当前 盒子模型 是否发生了 旋转, 这个参数可能 在哪个端都能用，但是 实际用途目前只在 h5 全屏中使用
        _rotate: {
          get () {
            return rotate
          }
        },
        // 初始化 小数位数
        _decimal: {
          get () {
            if (!tempData.data.length) {
              return 100
            } else {
              if (config.insType === insType.timeSharingDiagram) {
                return getDecimalValue(tempData.data[0].curPrice)
              }
              if (config.insType === insType.kLineGraph) {
                return getDecimalValue(tempData.data[0].close)
              }
            }
          },
          configurable: true
        },
        _defulatSale: {
          get () {
            return window.devicePixelRatio || 1
          }
        },
        _DOM: {
          get () {
            return DOM
          }
        },
        _DOMWidth: {
          get () {
            return DOMMess.width
          }
          // 现在 做成 直接 重新 实例 一个 ins
          /* ,
                    set (newValue) {
                        console.log("_DOMWidth:变化");
                        QL.updateView(config.insType, DOMMess);
                    } */
        },
        _DOMHeight: {
          get () {
            return DOMMess.height
          }
          // 现在 做成 直接 重新 实例 一个 ins
          /* ,
                    set (newValue) {
                        console.log("_DOMHeight:变化");
                        QL.updateView(config.insType, DOMMess);
                    } */
        },
        _device: {
          get () {
            return device
          }
        },
        _insType: {
          get () {
            return config.insType
          }
        },
        // 这个值 是 可以 被 配置的
        _data: {
          get () {
            return tempData
          },
          set (newValue) {
            /* 出现了指标线 计算，需要在 set的 时候，将获取到的 值 进行 处理 */
            console.log('set执行了嘛')
            let typeData = config.insType === insType.timeSharingDiagram ? { chartData: newValue } : { kData: newValue }

            typeData = QL.outputData({ ...options, data: typeData })

            if (config.insType === insType.timeSharingDiagram) {
              // console.log(newValue);
              tempData = typeData.chartData

              // 修改 小数位数
              Object.defineProperty(QL, '_decimal', {
                get () {
                  if (tempData.data.length) {
                    return 100
                  } else {
                    return getDecimalValue(tempData.data[0].curPrice)
                  }
                },
                configurable: true
              })

              /* 这里 进行重绘 */
              QL.paintTimeSharingDiagram(tempData)
            }
            if (config.insType === insType.kLineGraph) {
              tempData = typeData.kData
              /* 初始化 展示的 数量 的 区间 范围,并存储到 实例中，为了 做 事件的 时候使用 */
              const startI = tempData.data.length - calcConfig.kLineGraph.initShowN; const endI = tempData.data.length
              Object.defineProperties(QL, {
                _kMess: {
                  get () {
                    return {
                      startI,
                      endI,
                      showNumber: calcConfig.kLineGraph.initShowN
                    }
                  },
                  configurable: true
                },
                _decimal: {
                  get () {
                    if (tempData.data.length) {
                      return 100
                    } else {
                      return getDecimalValue(tempData.data[0].close)
                    }
                  },
                  configurable: true
                }
              })

              /* 这里 进行重绘 */
              // console.log('====重绘', tempData);
              QL.kLineGraphPaint(tempData)
            }
          },
          configurable: true
        }
      })
    })(QL)

    // 这里要对 不同的实例 做 不同的 初始化
    if (config.insType === insType.timeSharingDiagram) {
      initTimeSharingDiagram(QL, data.chartData)
    }
    if (config.insType === insType.kLineGraph) {
      initkLineGraph(QL, data.kData)
    }

    // 初始化 所有监听事件，在 内部 进行 区分 客户端
    QL.eventInit()
  }

  // 初始化 时分秒 方法 需要 暴露出去
  QLStockMarket.prototype.paintTimeSharingDiagram = paintTimeSharingDiagram

  // 绘制 k线 图
  QLStockMarket.prototype.kLineGraphPaint = kLineGraphPaint
}

/* 处理 主题，这里可能 对应的 值 不存在，在内部 初始化的时候需要 设置 默认值 */
function dealTheme (QL, theme) {
  let defaultTheme = 'light'; let paintTheme = null
  if (isString(theme)) {
    defaultTheme = Theme[theme] ? theme : 'light'
    paintTheme = Theme[defaultTheme]
  }

  if (isObject(theme)) {
    paintTheme = theme
  }
  // console.log(paintTheme);
  Object.defineProperty(QL, '_theme', {
    get () {
      return paintTheme
    }
  })
}
