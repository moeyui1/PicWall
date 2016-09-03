var result = undefined
var Imgbox = React.createClass({
    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: undefined};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },
    render: function () {
        var imglist = <h3 className="text-center">图片加载中……</h3>

        if (this.state.data) {
            var imgJSON = this.state.data
            if (imgJSON.contents) {
                imglist = imgJSON.contents.map(function (illust) {
                    var link="http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" +illust.illust_id
                    var user_link="http://www.pixiv.net/member.php?id="+illust.user_id
                    console.log(link)
                    return (
                        <div className="grid-item" key={illust.illust_id}>
                            <a href={link}>
                                <div className="content">
                                    <img src={illust.url} className="natural pic"/>
                                    <p className="text-center">{illust.title}</p>
                                    <a href={user_link}>
                                        <img className="icon" src={illust.profile_img}/>
                                        <span className="icon-text">{illust.user_name}</span>
                                    </a>
                                </div>
                            </a>
                        </div>
                    );
                });
            }
        }

        return (
            //这里一定要用一个标签surrond变量，否则会报错
            <div>
                {imglist}
            </div>
        );
    },
    componentDidUpdate: function (prevProps, prevState) {
        loadImg()
    }
});


ReactDOM.render(
    <Imgbox url="/pixiv"/>, document.getElementById('test')
);
