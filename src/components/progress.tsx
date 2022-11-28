import React, { useRef, MouseEvent, useState, useEffect, useLayoutEffect, memo } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
position: relative;
margin: 0 12px;
height: 6px;
width: 100%;
background: #c8c8c8;
border-radius: var(--radius);
cursor: pointer;
overflow: hidden;
`;

const Bar = styled.div`
position: relative;
height: 100%;
width: 0;
max-width: 100%;
min-width: 0;
border-radius: inherit;
background: #3a3a3a;
will-change: width;
pointer-events: none;
transform: translateZ(0);
`;

type props = {
    value: number,
    total: number,
    onSetValue: Function
}

interface nEvent extends Event {
    clientX: number,
    offsetX: number
}

type Rect = {
    ow: number,
    ox: number,
    dragging: boolean,
    percentCache: number
}

const Progress: React.FC<props> = ({ value = 0, total = 1, onSetValue }) : JSX.Element => {
    const box = useRef<HTMLDivElement>(null);
    const [percent, setPercent] = useState<number>(0);
    const max = useRef<number>(total);
    const R = useRef<Rect>({
        ox: 0,
        ow: 0,
        dragging: false,
        percentCache: 0
    });
    

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [box]);

    useEffect(() => {
        if ( R.current.dragging ) return;
        setPercent(value / total);
    }, [value, total]);

    useEffect(() => {
        max.current = total;
    }, [total]);

    const handleMouseDown = (e: MouseEvent) => {
        let { current } = box;
        if ( !current ) return;

        let rect = current.getBoundingClientRect();
        let p = (e.clientX - rect.left) / rect.width;

        R.current.ox = rect.left;
        R.current.ow = rect.width;
        R.current.dragging = true;
        R.current.percentCache = p;

        setPercent(p);
    }

    function handleMouseMove (e: nEvent) {
        let { ox, ow, dragging } = R.current;
        if ( !dragging ) return;
        
        e.preventDefault();
        let d = e.clientX - ox;
        d = d < 0? 0: d;
        d = d > ow? ow: d;
        setPercent(d / ow);
        R.current.percentCache = d / ow;
    }

    const handleMouseUp = () => {
        let { dragging, percentCache } = R.current;
        if ( !dragging ) return;
        
        R.current.dragging = false;
        onSetValue(max.current * percentCache);
    }

    return <Wrapper ref={ box } onMouseDown={ handleMouseDown  }>
        <Bar style={{ width: `${ percent * 100 }%` }}></Bar>
    </Wrapper>
}

const areEqual = (p: props, n: props) => {
    return p.value === n.value && p.total === n.total;
}

export default memo(Progress, areEqual);