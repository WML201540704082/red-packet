const proxy = require('http-proxy-middleware')
module.exports = function(app) {
    app.use(
        proxy.createProxyMiddleware('/api', { //`api`是需要转发的请求
            target: 'http://47.242.74.180:9797/',
            changeOrigin: true
      
        })
    )
}