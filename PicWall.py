# coding: utf-8
import requests
from flask import Flask, Response,request
from flask import render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/pixiv')
def getPixivJson():
    PIXIV_URL = "http://www.pixiv.net/ranking.php?mode=daily&content=illust&format=json"
    r = requests.get(PIXIV_URL)
    return Response(
        r.text,
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/pixiv/download')
def downloadPic(id, url):
    if (id == None):
        return "请选择一张需要下载的图片"
    r = requests.get(url, headers={
        'Referer': 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id={0}'.format(id),
        # 添加Referer，否则会返回403错误
        'User-Agent': 'Mozilla/5.0 (Macintosh; '
                      'Intel Mac OS X 10_10_5) '
                      'AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/45.0.2454.101 Safari/537.36'
    })
    return r.content


@app.route('/pixiv/user_avatar_ban')
def getAvatar():
    url=request.args.get('url')
    id=request.args.get('id')
    r = requests.get(url, headers={
        "Referer": 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id={0}'.format(id),
        'User-Agent': 'Mozilla/5.0 (Macintosh; '
                      'Intel Mac OS X 10_10_5) '
                      'AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/45.0.2454.101 Safari/537.36'
    })
    return r.content


@app.route('/yandere')
def getYandereJson():
    YANDERE_URL="https://yande.re/post/popular_recent.json"
    r = requests.get(YANDERE_URL)
    return Response(
        r.text,
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


if __name__ == '__main__':
    app.run(debug=False, port=9998)
