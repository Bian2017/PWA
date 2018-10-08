# PWA

谷歌官方视频[链接](https://www.youtube.com/watch?v=17kGWJOuL-A&list=PLNYkxOF6rcIAdnzEsWkg0KpMn2WJwMBmN)

PWA的基础是https://。

## Web App Mainifest

允许把站点添加到手机屏幕上。

创建网络应用清单manifest.json，代码见[分支daily/0.0.1](https://github.com/Bian2017/bgl-example-pwa/commit/817750fcda0afdef2c08884e09e5daf6ae63a45f)。

## Service Worker

Service Worker要求运行环境是HTTPS，localhost除外。

+ 浏览器在后台独立于网页运行的脚本；

+ 拦截和处理网络请求，操作缓存；

+ 支持Push API等;

+ 后台同步 & 更新缓存；

Service Worker区别于传统的JS文件，它不绑定在任何页面，它是全局的。在安卓手机上关闭页面时，Service Worker会在后台运行，用来推送消息。

![]()