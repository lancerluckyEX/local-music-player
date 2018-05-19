const sendHtml = (path, response) => {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

var index = {
    path: '/',
    method: 'get',
    func: (request, response) => {
        var path = 'template/index.html'
        sendHtml(path, response)
    }
}

var PlayList = {
    path: '/songs',
    method: 'post',
    func: (request, response) => {
        var fs = require('fs')
        var musicFilePath = 'static/mp3'
        var songsNamePath = 'db/songs.json'


        fs.readdir(musicFilePath, function(error, files) {
            console.log(files)
            var s = JSON.stringify(files, null, 2)
            fs.writeFile(songsNamePath , s, (error) => {
                if (error != null) {
                    console.log('error', error)
                } else {
                    console.log('保存成功')
                    var songs = fs.readFileSync(songsNamePath, 'utf8')
                    var data = JSON.parse(songs)
                    response.send(data)
                }
            })
        })
    }
}


var routes = [
    index,
    PlayList,
]

module.exports.routes = routes
