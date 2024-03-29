# canvas 在 移动端的绘制问题

## 物理像素（DP）

    物理像素也称设备像素，我们常听到的手机的分辨率及为物理像素，比如 iPhone 7的物理分辨率为750 * 1334。屏幕是由像素点组成的，也就是说屏幕的水平方向有750的像素点，垂直方向上有1334个像素点

## 设备独立像素（DIP）

    也称为逻辑像素，比如Iphone4和Iphone3GS的尺寸都是3.5寸，iphone4的物理分辨率是640 980，而3gs只有320 480，假如我们按照真实布局取绘制一个320px宽度的图像时，在iphone4上只有一半有内容，剩下的一半则是一片空白，为了避免这种问题，我们引入了逻辑像素，将两种手机的逻辑像素都设置为320px，方便绘制

## 设备像素比（DPR）

    DPR = 物理像素/逻辑像素  就是 window下的 devicePixelRatio

## 实际导致 pc 和 h5 上 canvas 绘制 失贞的 情况：

    就是因为 在 绘制 1px 前端 css 的像素点的 时候 和 物理像素点 不对应，导致 1 个 像素点 需要 四个 物理像素点 进行绘制，导致 设备 运用 平滑过渡效果四个点，导致 模糊不清；

# 解决移动端模糊的 问题： 精髓 就是 用 一个 css 像素点，绘制 一个 物理像素 点，就是 放大 媒体对象 canvas(等价于 img)；

    将 canvas 看做 是 img，在 canvas 上 有 style.width style.height attr.width attr.height,这四个值 代表 在 浏览器 绘制的宽高 和 canvas 画布 实际 的 宽高；我们 放大 canvas 的 宽 和 高 ，让他 和 物理像素 一样就可以了；

```js
//html
;<canvas></canvas>
//js
canvas.style.width = '100px'
canvas.style.height = '100px'
const dps = window.devicePixelRatio
canvas.width = canvas.style.width * dps
canvas.height = canvas.style.height * dps
// 这样其实 造成了 在 绘制 canvas 的 时候，实际 坐标系 边界变大了，所以 需要 放大 坐标系,让 坐标系的 边界点 (最大的 x，y) 不变
const ctx = canvas.getContext('2d')
ctx.scale(dps, dps)
```

# npm 包的 发布等一些列问题

    ```js
    //1、新增注册 用户
        npm adduser
    //2、有的 用户，登录
        npm login
    //3、发布包到npm上
        npm publish
    //4、查看某个包的所有这
        npm owner ls "具体的包名"
    //5、由于默认对于当前包只有创建者有编辑权限，可以通过下面的 命令进行 新增权限 和 删除权限
        npm owner add "用户名" "包名"

        npm owner rm "用户名" "包名"
    ```

# 对于单元测试 jest 的理解

    概况：这是一个比较完整的测试库，包括了断言，mock等等，可以开箱即用；并且对于不同的 js 框架 比如 react，vue 都有很好的支持
    理解：对于前端测试 大方向 主要模块，方法结构断言、数据请求、以及框架不同模板比如.jsx、.vue、.node 等；

    实际在单元测试，不只是对于 function的测试，可能还包括 通用的 vue或者react组件的单元测试，这里其实可以对于 core的实例 进行单元测试

# 对于 此库的 e2e 测试 准备使用 Nightwatch

    对于 Nightwatch 的定义：Nightwatch.js is an automated testing framework for web applications and websites, written in Node.js and using the W3C WebDriver API.

## 这里出现 的 几个东西与 Nightwatch 的关系：

    1、WebDriver：这是w3c 指定的 一种标准，用于自动化控制浏览器，注意这是一种标准；
    2、Selenium：这个算是对于 webDriver 这套东西的 实现，比较流行并且全面的实现；相当于是一种库；安装：selenium-server(由于这个是 java写的，虽然实现了其他语言，实测需要安装 java JDK)
    3、对于webDriver 针对不同的厂商，实现了不同的 WebDriver(微型浏览器)，比如：geckodriver、chromedriver等等，到 Nightwatch 官网上看；

# 20200312 时间节点后

## jest 大体

```js
/* 
        1、matches =====> 匹配 数字，字符串，iterate 的 值的 匹配
        2、test async code ====> 测试 异步函数 的 结果或者是 想 测试的点
        3、setup and teardown：组装和拆卸 ====> 就是在每次测试的时候，可以用钩子一样的东西，写一次数据多次用beforeEach,afterEach
        4、mock Fuction ====> 用jest的fn模拟，获取不同的数据，还可以用于接口测试
        5、jest platform ====> jest 中的功能，可以单独 作为 package 用于 有 特征的功能；
    */
```

```js
/* 
        1、snapshot 快照对比，其实就是 ui层的 对比；
            注意：由于快照对比，有缓存，如果后期修改组件后，比较，需要更新 快照：jest --updateSnapshot
     */
// 运用个用 jest + Enzyme 给 react 的 ui 组件 做测试
/* 
        enzyme提供了三种渲染方式，render、mount、shallow，分别存在以下区别：

            1、render采用的是第三方库Cheerio的渲染，渲染结果是普通的html结构，对于snapshot使用render比较合适。

            2、shallow和mount对组件的渲染结果不是html的dom树，而是react树，如果你chrome装了react devtool插件，他的渲染结果就是react devtool tab下查看的组件结构，而render函数的结果是element tab下查看的结果。

            3、shallow和mount的结果是个被封装的ReactWrapper，可以进行多种操作，譬如find()、parents()、children()等选择器进行元素查找；state()、props()进行数据查找，setState()、setprops()操作数据；simulate()模拟事件触发。

            4、shallow只渲染当前组件，只能能对当前组件做断言；mount会渲染当前组件以及所有子组件，对所有子组件也可以做上述操作。一般交互测试都会关心到子组件，我使用的都是mount。但是mount耗时更长，内存啥的也都占用的更多，如果没必要操作和断言子组件，可以使用shallow。
    */
```

## 解决 安装包模块 报错 node-gyp node-sass 的错误 https://blog.csdn.net/kevinyankai/article/details/104736594/

## eslint + prettier 的 URL： https://segmentfault.com/a/1190000015315545?utm_source=tag-newest

## 对于 jest 中的 snapshot（快照）

注意：在 插件 发生变化 的时候，想 更新 快照 的命令： jest -u （jest update 的意思）
enzyme 和 react-test-renderer 在 生成快照的时候，react-test-renderer 生成的时候 reactDOM，而 enzyme 生成的是 `ReactWrapper {}`；

---

    如果 想让 enzyme 也显示 reactDOM 的 jSON 字符的快照，用上 enzyme-to-json 来 格式化

---

# 20200925 需求 弄出的问题

1、详细了解 npm、yarn 在 安装包 中，如何 更好的 较少插件安装的 依赖模块的 安装；
2、npm、yarn 中 如何 配置 module 的 入口 地址；
3、详细了解 package.json 的 主要信息的 用途
4、umd 模式的 webpack 打包如何 让 css 进行分离

## 20200926 了解上面提出的问题

1、了解了 一个 远程关联本地仓库的方法

```shell
git remote add origin 远程地址
```

2、对于 package.json 的 详解 地址

```url
https://docs.npmjs.com/files/package.json
```

3、解释 20200925 的问题

````md
# 一个插件的 发布 需要 对于 依赖 包的安装，减少 依赖属于 代码层 构建的 最小化插件 部署

## 对于 最小化 部署，可以 创建 .npmignore 文件

```.npmignore
# .npmignore
src <!-- 这就是 主代码 的 屏蔽提交，较少包的体积 -->
examples
.babelrc
.gitignore
webpack.config.js
```

# 在 npm 官网 没看到 module 作为 入口的 说法，还是 通过 main 作为 模块的 主入口，这里 可以 将 打包生成 好的 dist 文件的 ql-stockmarket.min.js 作为 主入口，就不需要 去 安装过多 的依赖了

# 分离 css 在 webpack 层面，用 mini-css-extract-plugin

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.rules[0] = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { url: false, sourceMap: true } },
    { loader: 'sass-loader', options: { sourceMap: true } },
  ],
}
```
4、完整的 发布包的 过程参照
```url
https://juejin.im/post/6844903773094019080
```

# 20201014 开始发包到 npm
1、切换镜像源 npm config set registry=http://registry.npmjs.org --- 为了 让 npm 实际 登陆到 官网 而不是 淘宝上
 后面切换回来 npm config  set https://registry.npm.taobao.org/
2、npm login

3、删除 某个 包 --- npm unpublish 报名 --force


# 20211222 日，由于 当前的 打包依赖的 node-sass 和 sass—loader 的版本太老了，导致 在当前环境一直编译不过 node-sass；解决
安装Python 2.7（v3.x.x不支持），安装后要配置环境变量。成功后执行npm config set python python2.7
执行 npm config set msvs_version 2017