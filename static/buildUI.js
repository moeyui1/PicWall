const instance = Layzr();
const PIXIV_URL = '/pixiv';
const YANDERE_URL = "/yandere"
class PixivItem extends React.Component {
    componentDidMount(prevProps, prevState) {
        NProgress.inc();
    }

    render() {
        var illust = this.props.data;
        var link = "http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + illust.illust_id;
        var user_link = "http://www.pixiv.net/member.php?id=" + illust.user_id;
        return (
            <div className="grid-item hvr-radial-out col-xs-6 col-sm-3 col-md-2" key={illust.illust_id}>
                <div className=" content ">
                    <a href={link}>
                        <img src="/static/placeholder.png" data-normal={illust.url} className="natural pic "/>
                    </a>
                    <p className="text-center">{illust.title}</p>
                    <a href={user_link}>
                        {/*<img className="icon" src="/static/loading.gif"*/}
                             {/*idata-normal={'/pixiv/user_avatar?url=' + illust.profile_img.replace(/\//g, "%2F").replace(/:/g, "%3A").replace(/-/g, "%2d").replace(/_/g, "%5F") + '&id=' + illust.illust_id}/>*/}
                        <span className="icon-text">{illust.user_name}</span>
                    </a>
                </div>
            </div>
        );
    }
}
class YandereItem extends React.Component {
    componentDidMount(prevProps, prevState) {
        NProgress.inc();
    }

    render() {
        var illust = this.props.data;
        var link = "#";
        var user_link = "#";
        return (
            <div className="grid-item hvr-radial-out col-xs-6 col-sm-3 col-md-2" key={illust.illust_id}>
                <div className=" content ">
                    <a href={link}>
                        <img data-normal={illust.preview_url} className="natural pic "/>
                    </a>
                    <p className="text-center">{illust.tags}</p>
                    <a href={user_link}>
                        {/*<img className="icon" data-normal="/static/loading.gif"/>*/}
                        <span className="icon-text">{illust.author}</span>
                    </a>
                </div>
            </div>
        );
    }
}


class Imgbox extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        instance.update().check().handlers(true);
        if (window.$grid != undefined) {
            window.$grid.masonry('reloadItems');
        }
        // 将图片排序
        else {
            window.$grid = $(this.refs.grid).masonry({
                // options
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                percentPosition: true
            });
        }
        instance
            .on('src:after', image => {
                // add a load event listener
                image.addEventListener('load', event => {
                    window.$grid.imagesLoaded().progress(
                        function () {
                            window.$grid.masonry('layout');
                        }
                    );
                });

            });

        window.$grid.imagesLoaded().progress(
            function () {
                window.$grid.masonry('layout');
            }
        );
        window.$grid.masonry('layout');

        NProgress.done()
    }

    render() {
        var imglist = <p className="text-center">图片加载中</p>
        if (this.props.data) {
            var imgJSON = this.props.data;
            if (this.props.url == PIXIV_URL)
                imglist = imgJSON.contents.map(function (illust) {
                    return (<PixivItem data={illust} key={illust.illust_id}/>);
                });
            else if (this.props.url == YANDERE_URL) {
                imglist = imgJSON.map(function (illust) {
                    return (<YandereItem data={illust} key={illust.id}/>);
                });
            }
        }

        return (
            //这里一定要用一个标签surrond变量，否则会报错
            <div>
                <div className="grid bricklayer" ref="grid">
                    {imglist}
                </div>
            </div>
        );
    }
}

class Header extends React.Component {

    toPixiv() {
        $(this.refs.yandere).toggleClass("active");
        $(this.refs.pixiv).toggleClass("active");
        this.props.loader('/pixiv');
    }

    toYandere() {
        $(this.refs.pixiv).toggleClass("active");
        $(this.refs.yandere).toggleClass("active");
        this.props.loader('/yandere');
    }

    render() {
        return (
            <nav className="navbar navbar-default" role="navigation">
                <div className="container-fluid">
                    {/*<!-- Brand and toggle get grouped for better mobile display -->*/}
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="">Ranking</a>
                    </div>
                    {/*<!-- Collect the nav links, forms, and other content for toggling -->*/}
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className="active" ref="pixiv"><a href="javascript:void(0)"
                                                                  onClick={()=>this.toPixiv()}>Pixiv</a>
                            </li>
                            <li ref="yandere"><a href="javascript:void(0)"
                                                 onClick={()=>this.toYandere()}>Yandere</a>
                            </li>
                        </ul>
                        {/*<form className="navbar-form navbar-left" role="search">*/}
                        {/*<div className="form-group">*/}
                        {/*<input type="text" className="form-control" placeholder="Search"/>*/}
                        {/*</div>*/}
                        {/*<button type="submit" className="btn btn-default">Submit</button>*/}
                        {/*</form>*/}
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="https://github.com/moeyui1/PicWall">Star on GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

        );
    }
}
class Root extends React.Component {
    constructor() {
        super();
        this.state = {url: PIXIV_URL, data: null};
        this.loadJsonFromServer(this.state.url)
    }

    loadJsonFromServer(url) {
        NProgress.start();
        $.ajax({
            url: url,
            cache: false,
            success: (data) => {this.setState({data: data, url: url})},
            error: (xhr, status, err) =>
                console.error(url, status, err.toString())

        });

    }

    render() {
        return (
            <div>
                <Header loader={(url)=>this.loadJsonFromServer(url)} parent={this}/>
                <div className="container-fluid">
                    <Imgbox data={this.state.data} url={this.state.url}/>
                </div>
            </div>
        );
    }


}


ReactDOM.render(
    <Root />, document.getElementById('test')
);


