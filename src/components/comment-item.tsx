import styled from "styled-components";
import { CommentItem } from '../api/interface'

const Row = styled.div`
margin: 8px 0;
padding: 8px 12px;
transition: all .24s;
border-radius: var(--radius);
&:hover {
    background: #efefef;
}
&.nested-comment {
    margin-left: 20px;
    font-size: 12px;
    background: #ddd;
}
`;

const Avatar = styled.img`
margin: 0;
width: 24px;
height: 24px;
border-radius: var(--radius);
`;

const Name = styled.b`
margin: 0 12px;
`;

const Content = styled.div`
margin: 4px 0 4px 36px;
`;

const Time = styled.time`
opacity: .6;
`;

const Location = styled.span`
margin: 0 8px 0 36px;
opacity: .6;
&:empty {
    margin-right: 0;
}
`;

const Like = styled.a`
margin-left: auto;
color: #888;
> .iconfont {
    margin: 0 4px 0 0;
}
`;

type props = {
    comment: CommentItem,
    isReplied: boolean
}

const Item : React.FC<props> = ({ comment, isReplied }) : JSX.Element => {

    const { avatar, user, time, likedCount, liked, content, location, beReplied } = comment;

    if ( isReplied ) {
        return <Row className="nested-comment">
            <div className="flex nested-comment">
                <Avatar src={ avatar }></Avatar>
                <Name>{ user }:</Name>
            </div>
            <Content>{ content }</Content>
            <div className="flex">
                <Location>{ location }</Location>
                <Time>{ time }</Time>
            </div>
        </Row>
    } else {
        return <Row>
            <div className="flex">
                <Avatar src={ avatar }></Avatar>
                <Name>{ user }:</Name>
                <Like className="flex">
                    <i className="iconfont icon-favorite-border"></i>
                    <span>{ likedCount }</span>
                </Like>
            </div>
            <Content>{ content }</Content>
            <div className="flex">
                <Location>{ location }</Location>
                <Time>{ time }</Time>
            </div>
            {
                beReplied.map((item: CommentItem) : JSX.Element => {
                    return <Item comment={ item } isReplied={ true } key={ item.id }></Item>
                })
            }
            
        </Row>
    }
}

export default Item;