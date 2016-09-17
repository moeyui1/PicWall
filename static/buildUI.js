var jsondata = [];   //原始榜单json数据
const instance = Layzr();


var ImgItem = React.createClass({
    render: function () {
        var illust = this.props.data;
        var link = "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + illust.illust_id;
        var user_link = "http://www.pixiv.net/member.php?id=" + illust.user_id;
        // console.log(link)
        return (
            <div className="grid-item col-xs-6 col-sm-3 col-md-2" key={illust.illust_id}>
                <div className="content">
                    <a href={link}>
                        <img data-normal={illust.url} className="natural pic "/>
                    </a>
                    <p className="text-center">{illust.title}</p>
                    <a href={user_link}>
                        <img className="icon"
                             src={'/pixiv/user_avatar?url=' + illust.profile_img.replace(/\//g, "%2F").replace(/:/g, "%3A").replace(/-/g,"%2d").replace(/_/g,"%5F") + '&id=' + illust.illust_id}/>
                        <span className="icon-text">{illust.user_name}</span>
                    </a>
                </div>
            </div>
        );
    }
});
var Imgbox = React.createClass({

    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            cache: false,
            success: function (data) {
                // console.log(data)
                jsondata = data.contents;
                this.setState({data: jsondata, width: "90"});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    getInitialState: function () {
        return {data: undefined, width: 20, grid: $('.grid')};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },

    constructPicHtml: function (illust) {
        return (
            <ImgItem data={illust} key={illust.illust_id}/>
        );
    },
    componentDidUpdate: function (prevProps, prevState) {
        console.log("from imgbox");
        instance.update().check().handlers(true);

        //将图片排序
        var $grid = $('.grid').masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true
        });
        instance
            .on('src:after', image => {
                // add a load event listener
                image.addEventListener('load', event => {
                    // ...
                    $grid.imagesLoaded().progress(
                        function () {
                            $grid.masonry('layout');
                        }
                    );
                })
            });
    },
    render: function () {
        var imglist = <p className="text-center">图片加载中</p>
        if (this.state.data) {
            var imgJSON = this.state.data;
            imglist = imgJSON.map(this.constructPicHtml);
        }
        return (
            //这里一定要用一个标签surrond变量，否则会报错
            <div>
                <ProcessBar width={this.state.width}/>
                <div className="grid">
                    {imglist}
                </div>
            </div>
        );
    },


});
class ProcessBar extends React.Component {
    render() {
        if (this.props.width == '90')
            return null;
        return (
            <div className="progress" height={'100%'}>
                <div className="progress-bar progress-bar-striped active" role="progressbar"
                     aria-valuenow={this.props.width}
                     aria-valuemin="0" aria-valuemax="100" style={{width: this.props.width + '%'}}>
                    <span className="sr-only">{this.props.width} Complete</span>
                </div>
            </div>
        );
    }
}
class Header extends React.Component {
    render() {
        return (
            <div>
                <h3>图站日榜</h3>
                <ul className="nav nav-pills " role="tablist" id="headerbar">
                    <li role="presentation" className="active"><a href="#">Home</a></li>
                    <li role="presentation"><a href="#">Pixiv</a></li>
                    <li role="presentation"><a href="#">yande.re</a></li>
                </ul>
            </div>
        );
    }
}
var Root = React.createClass(
    {
        render: function () {
            return (
                <div className="container-fluid">
                    <Header/>
                    <Imgbox url={this.props.url}/>
                </div>
            );
        }

    }
);


ReactDOM.render(
    <Root url="/pixiv"/>, document.getElementById('test')
);


// console.log($grid.masonry('getItemElements'),$('.grid'));


document.addEventListener('DOMContentLoaded', event => {
    instance
        .update()           // track initial elements
        .check()            // check initial elements
        .handlers(true);     // bind scroll and resize handlers
});
