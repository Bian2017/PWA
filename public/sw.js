

self.addEventListener('install', function (event) {
  console.log("SW Installed")

  // 延长事件的寿命从而阻止浏览器在事件中的异步操作完成之前终止Service Work线程
  event.waitUntil(caches.open('static')
    .then(function (cache) {
      cache.add('/')
      cache.add('/index.html')
      cache.add('/src/js/app.js')

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

// 关闭页面，再重新打开页面，会激活该事件
self.addEventListener('activate', function () {
  console.log("SW Activated")
})

// 针对网络请求，在缓存中先进行匹配，若匹配，则将缓存的文件返回；否则另外发起请求。作用相当于网络代理。
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