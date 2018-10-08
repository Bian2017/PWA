Example PWA
---

[参考视频](https://www.youtube.com/watch?v=I3jTvWj8JrQ)

[参考文章](https://developers.google.com/web/fundamentals/primers/service-workers/)

## 一、网络应用清单(Mainifest)

网络应用清单是一个 JSON 文件，开发者可以利用它控制在用户想要看到应用的区域（例如移动设备主屏幕）中如何向用户显示网络应用或网站，指示用户可以启动哪些功能，以及定义其在启动时的外观。

先创建一个基本清单，然后为其链接一个网页，修改代码见[分支daily/0.0.1](https://github.com/Bian2017/bgl-example-pwa/commit/817750fcda0afdef2c08884e09e5daf6ae63a45f)。

## 二、服务工作线程(Service Workers)

Service Workers是浏览器在后台独立于网页运行的脚本。它区别于传统的JS文件，作用于全局，无需绑定任何页面。在手机上运行时，即使关闭浏览器页面，Service Workers依旧在后台运行，可用来实现推送通知和后台同步等功能。

+ 它是一种 JavaScript 工作线程，无法直接访问 DOM。 Service Workers通过响应 postMessage 接口发送的消息来与其控制的页面通信，页面可在必要时对 DOM 执行操作；
+ Service Workers是一种可编程网络代理，让您能够控制页面所发送网络请求的处理方式。
+ 它在不用时会被中止，并在下次有需要时重启，因此，您不能依赖于Service Workers的 onfetch 和 onmessage 处理程序中的全局状态。如果存在您需要持续保存并在重启后加以重用的信息，Service Workers可以访问 IndexedDB API。

### 2.1 必要条件HTTPS

在开发过程中，可以通过 localhost 使用Service Workers，但如果要在网站上部署Service Workers，需要在服务器上设置 HTTPS。

### 2.2 注册Service Workers

要安装Service Workers，您需要通过在页面中对其进行注册来启动安装。 这将告诉浏览器Service Workers JavaScript 文件的位置，注册代码如下：

```JS
// 应用的每个页面都需要注册。
if ('serviceWorker' in navigator) {                       // 针对不支持的浏览器，则跳过注册
  navigator.serviceWorker.register('./sw.js')
    .then(function() {
      console.log("SW registered")
    })
}
```

### 2.3 安装Service Workers

为install事件定义回调，并决定想要缓存的文件。

```JS
self.addEventListener('install', function (event) {
  console.log("SW Installed")

  // 延长事件的寿命从而阻止浏览器在事件中的异步操作完成之前终止Service Work线程
  event.waitUntil(caches.open('static')
    .then(function (cache) {
      cache.addAll([
        '/',
        '/index.html',
        '/src/js/app.js',
        '/src/css/app.css',
        '/src/images/pwa.jpg',
        'https://fonts.googleapis.com/css?family=Raleway:400,700'
      ])
    })
  )
})
```

event.waitUntil() 方法带有 promise 参数并使用它来判断安装所花费的时间以及安装是否成功。

如果所有文件都成功缓存，则将安装Service Workers。 如有任何文件无法下载，则安装步骤将失败。 这可让您依赖于所定义的所有资产，但也意味着需要对您决定在安装步骤缓存的文件列表格外留意。定义一个过长的文件列表将会增加文件缓存失败的几率，从而导致Service Workers未能安装。

### 2.4 缓存和返回请求

您已安装服务工作线程，现在可能会想要返回一个缓存的响应，对吧？

在安装服务工作线程且用户转至其他页面或刷新当前页面后，服务工作线程将开始接收 fetch 事件。下面提供了一个示例:

```JS
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        if(res) {
          return res
        } else {
          return fetch(event.request)         // 返回一个Promise
        }
      })
  )
})
```

这里我们定义了 fetch 事件，并且在 event.respondWith() 中，我们传入来自 caches.match() 的一个 promise。 此方法检视该请求，并从服务工作线程所创建的任何缓存中查找缓存的结果。

![](https://raw.githubusercontent.com/Bian2017/bgl-example-pwa/master/docs/img/ServiceWorker.png )

如果发现匹配的响应，则返回缓存的值，否则，将调用 fetch 以发出网络请求，并将从网络检索到的任何数据作为结果返回。这是一个简单的例子，它使用了在安装步骤中缓存的所有资产。


## 三、Firebase线上部署

谷歌的 Firebase 平台提供了为移动端（iOS和Android）和 Web 端创建后端架构的完整解决方案。本项目将通过Firebase来实现线上部署。

### 3.1 全局安装firebase

> npm install -g firebase-tools

### 3.2 登录google

> firebase login

由于国内用户都使用代理进行FQ，所以会出现无法登录的情况，此时可以尝试修改firebase-tools工具下的request.js代码。，本项目的request.js代码位于/Users/XXX/.nvm/versions/node/v8.11.3/lib/node_modules/firebase-tools/node_modules/request。由于我的FQ软件代理服务器地址是'127.0.0.1:53234'，则代码进行如下修改：

```JS
// line 290 to 298
// if (!self.hasOwnProperty('proxy')) {
//   self.proxy = getProxyFromURI(self.uri)
// }
self.proxy = 'http://127.0.0.1:53234'    // 设置代理服务器

self.tunnel = self._tunnel.isEnabled()

if (self.proxy) {
  self._tunnel.setup(options)
}
```

然后重新运行firebase login，即可登录成功。

**注意：**

登录成功之后，要记得及时恢复上述代码。

### 3.3 启动项目

运行脚本：

> firebase init

然后选择“Hosting: Configure and deploy Firebase Hosting sites ”。然后选择你当前的项目，之后根据项目的需求进行相应配置。

![](https://raw.githubusercontent.com/Bian2017/bgl-example-pwa/master/docs/img/init.png)

### 3.4 部署网站

> firebase deploy

![](https://raw.githubusercontent.com/Bian2017/bgl-example-pwa/master/docs/img/deploy.png)

在手机浏览器上打开firebase deploy生成的网址: https://bgl-example-pwa.firebaseapp.com/，浏览器会提示将网站图标添加到手机屏幕上。此时离线情况下也可查看网址内容。

![](https://raw.githubusercontent.com/Bian2017/bgl-example-pwa/master/docs/img/PWA.png)