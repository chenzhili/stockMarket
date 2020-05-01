import { isFunction } from '../utils'
import { insType } from '../enums'

/*
  几个 需要 解决的问题：
    1、监听 width、height 两个 关键值发生变化的 怎样 较少 重复渲染；
    2、当 尺寸 发生变化的时候，需要 改变的 值；
      i、主 canvas 的 绘制 区域需要 发生变化
      ii、maskCanvas 的 绘制 区域也需要 发生变化；
    3、如何 让 ins 上的 尺寸值 跟着 变化

    ** 在 操作 过程中，遇到 vue 组件的 的数据没有 刷新， 所以还要检测 如何 刷新 vue 组件
    解决方案：
     在vue 刷新的时候，需要 重新获取 DOM

    绘制步骤：
      1、确定当前的resize是否需要 进行 重绘 ，可能存在 在 短时间内 同时改变了 两个值的情况；
      2、修改基础 配置，包括 上边 2 的所有 东西
      3、开始进行 差别绘制，绘制 之前 需要 清理 一下 画布(这一步 不用做了，在 paint的时候做了)
*/
/*
  可能 对于 data 数据的改变 一样需要 提取出来，但是是在 后期再来提取把；
  目前 只做 size 发生 变化的 视图 更新；
*/

/*
  *******
    解决方案,现在 不在 内部进行 重绘,由于 这个 实例 已经销毁了,这里 直接 重新 实例 一个 新的;
  *******
*/
export default function updateView (QLStockMarket) {
  const updateTime = null
  /**
   * @ type 实例类型
   * @ DOMMess 实例 为了 修改 QL 实例 内的 值
   */
  QLStockMarket.prototype.updateView = function (type, DOMMess) {

    // const QL = this;
    // updateTime && clearTimeout(updateTime);
    // // /* 让 vue 组件 进行 重绘 */
    // // isFunction(QL.refresh) && QL.refresh(true);
    // updateTime = setTimeout(() => {
    //   console.log("绘制几次");
    //   console.log(QL);
    //   // 准备数据
    //   const { _mainCvs: mainCvs, _maskCvs: maskCvs, _DOM: DOM } = QL;

    //   let { width, height } = DOM.getBoundingClientRect();
    //   let { "border-left-width": leftWidth, "border-right-width": rightWidth, "border-top-width": topWidth, "border-bottom-width": bottomWidth, } = getComputedStyle(DOM);
    //   width = width - (parseFloat(leftWidth) + parseFloat(rightWidth));
    //   height = height - (parseFloat(topWidth) + parseFloat(bottomWidth));
    //   mainCvs.width = maskCvs.width = width * QL._defulatSale;
    //   mainCvs.height = maskCvs.height = height * QL._defulatSale;

    //   mainCvs.style.width = maskCvs.style.width = `${width}px`;
    //   mainCvs.style.height = maskCvs.style.height = `${height}px`;

    //   DOMMess.width = width;
    //   DOMMess.height = height;
    //   console.log(QL._DOMWidth);

    //   if (type === insType.timeSharingDiagram) {
    //     QL.paintTimeSharingDiagram();
    //   }
    //   if (type === insType.kLineGraph) {
    //     QL.kLineGraphPaint();
    //   }
    // });

  }
}
