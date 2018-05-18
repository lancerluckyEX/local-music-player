var express = require('express')
var app = express()
var bodyParser = require('body-parser')


app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))

const registerRoutes = (app, routes) => {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}

const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

var host = 'localhost'
var port = 3000

var server = app.listen(port, host,() => {
    console.log(`本地音乐播放器，访问地址为 ${host}:${port}`)
})
