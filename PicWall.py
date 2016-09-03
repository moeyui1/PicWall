import requests
from flask import Flask ,Response
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


if __name__ == '__main__':
    app.run(debug=True)
