/**
 * Created by moeyui on 2016/9/13 0013.
 */


var jsondata = []   //原始榜单json数据
var counter = 0
var current_datalist = []
class ImgItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var illust = this.props.data;
        const link = "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + illust.illust_id
        const user_link = "http://www.pixiv.net/member.php?id=" + illust.user_id
        return
            <div className="grid-item" key={illust.illust_id}>
                <a href={link}>
                    <div className="content">
                        <img src={illust.url} className="natural pic "/>
                        <p className="text-center">{illust.title}</p>
                        <a href={user_link}>
                            <img className="icon" src={illust.profile_img}/>
                            <span className="icon-text">{illust.user_name}</span>
                        </a>
                    </div>
                </a>
            </div>
        ;
    }
}
class Imgbox extends React.Component {
    constructor(props) {
        super(props);
        return {data: undefined};
    }

    addData() {
        // console.log('scroll!')
        var result;
        if (counter + 17 <= jsondata.length - 1) {
            result = jsondata.slice(counter, counter + 17)
            counter += 18

        } else {
            result = jsondata.slice(counter);
            counter = -1
        }
        var current_datalist = this.state.data == undefined ? [] : this.state.data
        this.setState({data: current_datalist.concat(result)})
    }

    loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            cache: false,
            success: function (data) {
                // console.log(data)
                jsondata = data.contents
                // this.setState({data: addData()});
                this.addData()
                // this.props.onAdddata()
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    }

    componentDidMount() {
        this.loadCommentsFromServer();
        $(window).scroll(function () {
            if ($(document).height() - $(window).scrollTop() - $(window).height() < 100)
                Imgbox.this.addData()
        })
    }

    handleOnWheel(e) {
        // console.log($(window).scrollTop(),"    ",$(window).scrollHeight())
        if ($(document).height() - $(window).scrollTop() - $(window).height() < 10)
            this.addData()
    }

    constructPicHtml(illust) {
        return
            <ImgItem data={illust}/>
        ;
    }

    render() {
        var imglist = <h3 className="text-center">图片加载中……</h3>
        if (this.state.data) {
            var imgJSON = this.state.data
            imglist = imgJSON.map(this.constructPicHtml);
        }
        return
            //这里一定要用一个标签surrond变量，否则会报错
            <div onWheel={this.handleOnWheel.bind(this)}>
                {imglist}
            </div>
        ;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log($('.grid-item').length)
        this.loadImg()
    }

    loadImg() {
        console.log('local arrange ', $('.grid-item').length);
        var $grid = $('.grid').masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true
            // fitWidth: true
        });

        $grid.masonry(
            'appended', elements
        );

        $grid.imagesLoaded().progress(
            function () {
                $grid.masonry('layout');
            }
        )
    }
}

ReactDOM.render(
    <Imgbox url="/pixiv"/>, document.getElementById('test')
);
