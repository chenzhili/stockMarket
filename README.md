# 项目描述

    就是用于制作react 和 vue 的 有关 行情 的 组件
    目前打包发布的是 vue 相关的组件，如果有react相关使用需求或者只是想用 core.js 可以到github 中 自行打包

    所有示例：github 的 /example中

## 主要核心目录结构

    主逻辑：/src/core/index.js 为入口
    ui目录：
        1、vue目录：/src/vueCom/index.js 为入口
        2、react目录:/src/reactCom/index.js 为入口

## 基本用法

1、统一的 props
dataGraph[Object]： 这个是 主数据
时分图：

```js
    dataGraph = {
        data[Array:Object]: timeSharing, //一个 item 的 Object {time,curPrice,rate,totalMoney,avPrice,dealMount};分别对应的意义{时间,当前价,收益率,成交总价,平均价,成交量}
        preClosePrice[String]: prevPrice, //这是 昨天的收盘价
    }
```

k线图:

```js
    /* dataGraph = {
        data[Array:Object]: kData, //一个 item 的 Object {date,dealMount,open,high,low,close,rate};分别对应的意义{日期,成交量,开盘价,最高价,最低价,收盘价,收益率}
    } */
    /* 由于转换周期的增加，字段发生变化 */
     dataGraph={
         data:"对应的历史数据，每一项的值跟上面一样",
         curData:"对应当前开盘的数据，每一项的值跟上面一样"
     }
     config={
        insType: insType.kLineGraph,
        theme: "light",
        initShowN // number 当前初始化的 k线的 根数
        hideDealGrid // boolean 隐藏量为true，可以不传
      }
     height="height容器的区域"
     sTt=[source,target] //source是资源数据的对应的类型，target是需要转换的标准
     /*
        target:
        m5: 5,  //五分钟
        m30: 30, //30分钟
        m60: 60, //60分钟
        w: 70,   //周
        q: 80,   // 季度
        hy: 90,  //半年
        y: 100  // 年


        source:
        m1: 1,  //1分钟
        m15: 15, //15分钟
        d: 65, //  日
        M: 75  // 月

        20200225目前实现的转换：分钟转换为其他分钟，日转换为周
*/
```

        config[Object]：这个是配置信息
        例子：

```js
    {
        insType: insType.timeSharingDiagram,//实例的类型，有 timeSharingDiagram: "0",kLineGraph: "1"
        theme: "light",//主体，有 light , dark
    }
```

        width[String]：这个是需要绘制的宽度

        height[String]：这个是需要绘制的高度

2、vue:

```js
import QLStockMarket from 'stock-market-graph'
Vue.use(QLStockMarket)
//就可以直接应用 插件了
kLineGraphPC, TimeSharingPC, kLineGraphForH5, TimeSharingH5
```

3、react:

```js
import QLStockMarket from 'stock-market-graph'
import {
  kLineGraphPC,
  TimeSharingPC,
  kLineGraphForH5,
  TimeSharingH5,
} from '路径'
```

## 对于框架的一些注意点

### canvas 在 移动端的绘制问题

    1、物理像素（DP）
    物理像素也称设备像素，我们常听到的手机的分辨率及为物理像素，比如 iPhone 7的物理分辨率为750 * 1334。屏幕是由像素点组成的，也就是说屏幕的水平方向有750的像素点，垂直方向上有1334个像素点

    2、设备独立像素（DIP）
    也称为逻辑像素，比如Iphone4和Iphone3GS的尺寸都是3.5寸，iphone4的物理分辨率是640 980，而3gs只有320 480，假如我们按照真实布局取绘制一个320px宽度的图像时，在iphone4上只有一半有内容，剩下的一半则是一片空白，为了避免这种问题，我们引入了逻辑像素，将两种手机的逻辑像素都设置为320px，方便绘制

    3、设备像素比（DPR）
    DPR = 物理像素/逻辑像素  就是 window下的 devicePixelRatio

    4、实际导致 pc 和 h5 上 canvas 绘制 失贞的 情况：
    就是因为 在 绘制 1px 前端 css 的像素点的 时候 和 物理像素点 不对应，导致 1 个 像素点 需要 四个 物理像素点 进行绘制，导致 设备 运用 平滑过渡效果四个点，导致 模糊不清；

    5、解决移动端模糊的 问题： 精髓 就是 用 一个 css 像素点，绘制 一个 物理像素 点，就是 放大 媒体对象 canvas(等价于img)；
    将 canvas 看做 是 img，在 canvas 上 有 style.width style.height attr.width attr.height,这四个值 代表 在 浏览器 绘制的宽高 和 canvas 画布 实际 的 宽高；我们 放大 canvas 的 宽 和 高 ，让他 和 物理像素 一样就可以了；

    ```js
        html
            <canvas></canvas>
        js
            canvas.style.width = "100px"
            canvas.style.height = "100px"
            const dps = window.devicePixelRatio;
            canvas.width = canvas.style.width * dps;
            canvas.height = canvas.style.height * dps;
            const ctx = canvas.getContext("2d");
            ctx.scale(dps,dps);
    ```

### 在实例化 canvas 的时候，注意不同方法 之间 的传参 问题，当前数据的共享性问题

### 在 事件监听中 防止 实例 内部 部分数据的 内存溢出 问题

## 最后打包问题，详情看 package.json 文件


## 20201109 发现的 bug，在 打包的 umd 文件 在 vue-cli 搭建的项目下，在 prod 环境下 找不到文件；解决办法；url： https://juejin.im/post/6844903826592366600
```bash
yarn add -D @babel/plugin-transform-modules-umd

# babel-config.js 或者 .babelrc 文件加入 plugins

plugins: ["@babel/plugin-transform-modules-umd"]
```
