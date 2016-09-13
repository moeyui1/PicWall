var jsondata = []   //原始榜单json数据
var counter = 0
var current_datalist = []
// function addData() {
//     var result
//     if (counter + 17 <= jsondata.length - 1) {
//         result = jsondata.slice(counter, counter + 17)
//         counter += 18
//
//     } else {
//         result = jsondata.slice(counter)
//         counter = -1
//     }
//     // Imgbox.setState({data: current_datalist.concat(result)})
// }

var ImgItem = React.createClass({
    render: function () {
        var illust = this.props.data;
        var link = "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + illust.illust_id
        var user_link = "http://www.pixiv.net/member.php?id=" + illust.user_id
        // console.log(link)
        return (
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
        );
    }
});
var Imgbox = React.createClass({

    addData: function () {
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
    },

    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            cache: false,
            success: function (data) {
                // console.log(data)
                jsondata = data.contents
                this.setState({data: jsondata});
                // this.addData()
                // this.props.onAdddata()
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    handleWindowsScroll: function () {
        if ($(document).height() - $(window).scrollTop() - $(window).height() < 100)
            this.addData()
    },
    getInitialState: function () {
        return {data: undefined};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        // $(window).scroll(this.handleWindowsScroll);
    },
    handleOnWheel: function (e) {
        // console.log($(window).scrollTop(),"    ",$(window).scrollHeight())
        if ($(document).height() - $(window).scrollTop() - $(window).height() < 10)
            this.addData()
    },
    constructPicHtml: function (illust) {
        return (
            <ImgItem data={illust}/>
        );
    },
    render: function () {
        var imglist = <h3 className="text-center">图片加载中……</h3>
        if (this.state.data) {
            var imgJSON = this.state.data
            imglist = imgJSON.map(this.constructPicHtml);
        }
        return (
            //这里一定要用一个标签surrond变量，否则会报错
            <div onWheel={this.handleOnWheel}>
                {imglist}
            </div>
        );
    },
    componentDidUpdate: function (prevProps, prevState) {
        console.log($('.grid-item').length)
        this.loadImg()
    },
    loadImg: function () {
        console.log('local arrange ', $('.grid-item').length);
        var $grid = $('.grid').masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true
            // fitWidth: true
        });
        // $grid.masonry('appended', elements)
        $grid.imagesLoaded().progress(
            function () {
                $grid.masonry('layout');
            }
        )
    }
});
var Root = React.createClass(
    {
        render: function () {
            return (
                <div>
                    <div className="container">
                        <h3 className="text-center">P站日榜</h3>
                    </div>
                    <div className="grid">
                        <Imgbox url={this.props.url}/>
                    </div>
                </div>
            );
        }
    }
);

ReactDOM.render(
    <Root url="/pixiv"/>, document.getElementById('test')
);

