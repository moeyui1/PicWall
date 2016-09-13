/**
 * Created by moeyui on 2016/9/13 0013.
 */
export class ImgItem extends React.Component {
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
