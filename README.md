# canvas 在 移动端的绘制问题

## 物理像素（DP）
    物理像素也称设备像素，我们常听到的手机的分辨率及为物理像素，比如 iPhone 7的物理分辨率为750 * 1334。屏幕是由像素点组成的，也就是说屏幕的水平方向有750的像素点，垂直方向上有1334个像素点

## 设备独立像素（DIP）
    也称为逻辑像素，比如Iphone4和Iphone3GS的尺寸都是3.5寸，iphone4的物理分辨率是640 980，而3gs只有320 480，假如我们按照真实布局取绘制一个320px宽度的图像时，在iphone4上只有一半有内容，剩下的一半则是一片空白，为了避免这种问题，我们引入了逻辑像素，将两种手机的逻辑像素都设置为320px，方便绘制

## 设备像素比（DPR）
    DPR = 物理像素/逻辑像素  就是 window下的 devicePixelRatio

## 实际导致 pc 和 h5 上 canvas 绘制 失贞的 情况：
    就是因为 在 绘制 1px 前端 css 的像素点的 时候 和 物理像素点 不对应，导致 1 个 像素点 需要 四个 物理像素点 进行绘制，导致 设备 运用 平滑过渡效果四个点，导致 模糊不清；

# 解决移动端模糊的 问题： 精髓 就是 用 一个 css 像素点，绘制 一个 物理像素 点，就是 放大 媒体对象 canvas(等价于img)；
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
        // 这样其实 造成了 在 绘制 canvas 的 时候，实际 坐标系 边界变大了，所以 需要 放大 坐标系,让 坐标系的 边界点 (最大的 x，y) 不变
        const ctx = canvas.getContext("2d");
        ctx.scale(dps,dps);
```

