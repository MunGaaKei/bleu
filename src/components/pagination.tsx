import { memo } from "react";
import styled from "styled-components";

type props = {
    page: number,
    total: number,
    onPageClick?: Function
}

const Wrapper = styled.div`
position: sticky;
bottom: -12px;
z-index: 1;
padding: 8px 0;
display: flex;
justify-content: center;
align-items: center;
margin: 20px 0 0;
`;

const Btn = styled.a`
display: flex;
margin: 0 4px;
padding: 4px 12px;
transition: all .24s;
font-weight: 700;
user-select: none;
white-space: nowrap;
border-radius: 4px;
font-size: 16px;
color: #999;
&:hover {
    color: #eee;
    background: #3a3a3a;
}
&.active {
    color: #212121;
    background: none;
    pointer-events: none;
}
`;

const Dots = styled.span`
margin: 0 4px;
padding: 8px;
`;

const Pagination : React.FC<props> = ({ page, total, onPageClick }) : JSX.Element => {

    if ( total === 0) {
        return <></>;
    }
    
    function formatPage ( p: number ): JSX.Element {
        return <Btn onClick={ () => { onPageClick && onPageClick(p) } }>{ p }</Btn>;
    }
    
    const S = 3;
    let html = <Btn className="active">{ page }</Btn>;

    let i = 1, prev, next;
    for (; i < S; i++) {
        prev = page - i;
        next = page + i;
        if ( prev > 1 ) {
            html = <>{ formatPage(prev) }{ html }</>;
        }
        if ( next < total ) {
            html = <>{ html }{ formatPage(next) }</>;
        }
    }

    if ( page - S > 1 ) {
        html = <>
            { formatPage(1) }
            <Dots>-</Dots>
            { html }
        </>;
    } else if (page != 1) {
        html = <>{ formatPage(1) }{ html }</>
    }
    
    if ( page + S < total ) {
        html = <>{html}<Dots>-</Dots>{ formatPage(total) }</>;
    } else if (page != total) {
        html = <>{html}{ formatPage(total) }</>;
    }


    return <Wrapper className="bg-blur">
        { html }
    </Wrapper>
}

const areEqual = (p: props, n: props) => {
    return p.page === n.page;
}

export default memo(Pagination, areEqual);