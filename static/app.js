/**
 * Created by moeyui on 2016/9/13 0013.
 */

import Imgitem from 'Imgitem'
var jsondata = []   //原始榜单json数据
var counter = 0
var current_datalist = []

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
        return <div onWheel={this.handleOnWheel.bind(this)}>
            {imglist}
        </div>;
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
