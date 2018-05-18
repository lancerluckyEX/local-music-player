var log = console.log.bind(console)

var e = function(selector) {
    var element = document.querySelector(selector)
    if (element == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

var es = function(selector) {
    var elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var bindAll = function(selector, eventName, callback) {
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

var play = function(audio) {
    var a = audio
    log('播放开始')
    a.play()
}

var findAllString = function(s1, s2) {
    var result = []
    var s2len = s2.length
    var s = ''

    for (var i = 0; i < s1.length; i++) {
        s = s1.slice(i, s2len + i)
        if (s == s2) {
            result.push(i)
        }
    }
    return result
}

var join = function(delimiter, array) {
    var s = array[0]
    for (var i = 1; i < array.length; i++) {
        var e = array[i]
        s = s + (delimiter + e)
    }
    return s
}

var split = function(s, delimiter=' ') {
    var l =[]
    var space = delimiter.length
    var start = 0
    for (var i = 0; i < s.length; i++) {
        var s_check = s.slice(i, i + space)
        if (s_check == delimiter) {
            var s_slice = s.slice(start, i)
            l.push(s_slice)
            start = i + space
        }
    }
    var s_end = s.slice(start)
    l.push(s_end)
    return l
}

var replaceAll = function(s, old, newString) {
    var l = split(s, old)
    var result = join(newString, l)
    return result
}

var clearSongname = function(songname) {
    var mp3str = '/mp3/'
    var songNameindex = findAllString(songname, mp3str)[0] + mp3str.length
    var songNamesuck = songname.slice(songNameindex)
    var songName = replaceAll(songNamesuck, '%20', ' ')
    return songName
}

var insertSongname = function(audio) {
    var songname = audio.src.slice(5)
    var h2 = e('#song-name')
    var name = clearSongname(songname)
    log('播放', name)
    h2.innerText = name
}

var pasue = function(audio) {
    var a = audio
    log('播放暂停')
    a.pause()
}

var audiotoggle = function(audio, button) {
    var a = audio
    var apath = button.dataset.path
    log(apath)
    a.src = apath
    insertSongname(a)
    a.addEventListener('canplay', function() {
        play(a)
    })
}

var choice = function(array) {
    var a = Math.random()
    a = a * array.length
    var index = Math.floor(a)
    log('index', index)
    return array[index]
}

var randomSong = function(songs) {
    var song = choice(songs)
    return song
}

var templatePlayList = function(index, song) {
    var time = ''
    var t = `
        <li class="list-song">
            <a class="audio-content" data-path="/mp3/${song}" data-id="${index}" href="#">${index+1}.${song}</a>
        </li>
    `
    return t
}

var insertPlayList = function(songs) {
    var html = ''
    var len = songs.length
    for (var i = 0; i < len; i++) {
        var b = songs[i]
        var t = templatePlayList(i, b)
        html += t
    }
    var div = document.querySelector('#id-music-list')
    div.innerHTML = html
}

var bindEventplaylist = () => {
    var plist = e('#playlist_btn')
    bindEvent(plist, 'click', function(event) {
        var self = event.target
        var controls_player = self.closest('.controls_player')
        var controls = self.closest('.controls')
        var audioplayer = self.closest('.audio-player')
        var list = audioplayer.querySelector('.list-content')
        list.classList.toggle('show')
    })
}

var bindEventaudiotoggle = function(audio) {
    var a = audio
    var selector = '.audio-content'
    bindAll(selector, 'click', function(event) {
        log('切换歌曲')
        var target = event.target
        audiotoggle(audio, target)
    })
}

var bindEventrandomloop = function(audio, songs) {
    var a = audio
    a.addEventListener('ended', function() {
        log('播放完毕')
        var song = randomSong(songs)
        log('播放下一首', song)
        var songpath = `/mp3/${song}`
        a.src = songpath
        a.load()
        play(a)
    })
}

var nextIndex = function(slide, offset) {
    var numberOfSongs = Number(slide.dataset.songs)
    var activeIndex = Number(slide.dataset.active)
    var i = (activeIndex + offset + numberOfSongs) % numberOfSongs
    return i
}

var playAtIndex = function(slide, index, songs, audio) {
    var nextIndex = index
    slide.dataset.active = nextIndex
    var songpath = `/mp3/${songs[nextIndex]}`
    audio.src = songpath
    insertSongname(audio)
    play(audio)
}

var bindEventSlide = function(audio, songs) {
    var selector = '.slide-button'
    var listContent = e('.list-content')
    listContent.dataset.songs = `${songs.length}`
    listContent.dataset.active = '0'
    bindAll(selector, 'click', function(event) {
        var button = event.target
        var slide = listContent
        var offset = Number(button.dataset.offset)
        var index = nextIndex(slide, offset)
        playAtIndex(slide, index, songs, audio)
    })
}

var bindEventsongname = function(audio) {
    var button = e('#play_btn')
    bindEvent(button, 'click', function(event) {
        insertSongname(audio)
    })
}

var bindEvents = (audio, songs) => {
    bindEventplaylist()
    bindEventrandomloop(audio, songs)
    bindEventaudiotoggle(audio)
    bindEventSlide(audio, songs)
    bindEventsongname(audio)
}

var _main = () => {
    var a = e('#audio')
    var request = {
        method: 'POST',
        url: '/songs',
        contentType: 'application/json',
        callback: function(response) {
            var songs = JSON.parse(response)
            insertPlayList(songs)
            var songpath = `/mp3/${songs[0]}`
            audio.src = songpath
            bindEvents(a, songs)

        }
    }
    ajax(request)

}


_main()
