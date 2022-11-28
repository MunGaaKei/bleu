import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../store/hooks";
import { querySongComment } from "../api";
import { CommentItem } from "../api/interface";
import Item from "../components/comment-item";
import Pagination from "../components/pagination";
import Text from "../components/text";

const Container = styled.div`
width: var(--width);
margin: 0 auto;
max-width: 100%;
position: relative;
`;

const Title = styled.h3`
margin: 0 0 20px;
text-align: center;
> .iconfont {
    font-size: 20px;
}
`;

const Comment : React.FC = () : JSX.Element => {

    const { current } = useAppSelector(state => state.playlist, (p, n) => p.current?.id === n.current?.id);
    if ( !current ) return <></>;

    const [page, setPage] = useState<number>(1);
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [hots, setHots] = useState<CommentItem[]>([]);
    const [count, setCount] = useState<number>(0);
    const [paging, setPaging] = useState<boolean>(true);
    const title = useRef<HTMLDivElement>(null);
    const box = useRef<HTMLDivElement>(null);

    const query = async (p: number) => {
        const res = await querySongComment(current.id, p - 1);
        
        if ( res ) {
            p === 1 && setHots(res.hotComments);
            setComments(res.comments);
            setCount(res.total);
        } else {

        }
        setPaging(false);
    }

    useEffect(() => {
        if ( paging && page === 1 ) return;
        if ( title.current && box.current ) {
            const pa = box.current.parentNode as HTMLElement;
            
            pa?.scrollTo({
                top: title.current.offsetTop - 40,
                behavior: 'smooth'
            });
        }
    }, [paging]);

    useEffect(() => {
        setPage(1);
        query(1);
    }, [current]);

    const handlePageClick = async (p: number) => {
        if ( paging ) return;
        setPaging(true);
        setPage(p);
        query(p);
    }

    const NormalComment = (): JSX.Element => {
        if ( paging ) {
            return <Text text="加载中..."></Text>
        } else {
            return <>
                {
                    comments.map((item: CommentItem) => {
                        return <Item comment={ item } key={ item.id } isReplied={ false }></Item>
                    })
                }
                <Pagination page={ page } total={ Math.ceil(count / 20) } onPageClick={ handlePageClick }></Pagination>
            </>
        }
    }

    return <Container ref={ box }>
        {
            hots.length ?
            <>
                <Title style={{ color: 'firebrick' }}><i className="iconfont icon-hot"></i> 热评</Title>
                {
                    hots.map((item: CommentItem) => {
                        return <Item comment={ item } key={ item.id } isReplied={ false }></Item>
                    })
                }
            </>
            :
            <></>
        }
        <Title ref={ title } style={{ marginTop: '80px' }}>更多评论 ({ count })</Title>
        <NormalComment></NormalComment>
    </Container>
}

export default memo(Comment);
