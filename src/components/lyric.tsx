import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { queryLyric } from '../api';
import { useAppSelector } from '../store/hooks';

const Container = styled.div`
position: relative;
color: #8a8a8a;
font-size: 16px;
height: 100%;
box-sizing: border-box;
padding: 8px 20px 400px 20px;
overflow-x: hidden;
&::-webkit-scrollbar {
    width: 0;
    height: 0;
}
`;

const Line = styled.div`
margin: 4px 0;
transition: all .15s;
&.past {
    color: #3a3a3a;
}
&.current {
    font-weight: 700;
    color: #212121;
    font-size: 20px;
}
`;

interface L {
    time: number,
    content: string
}

const Lyric : React.FC = () : JSX.Element => {

    const { time, current } = useAppSelector(state => state.playlist);
    if (!current) return <></>;
    const [lyric, setLyric] = useState<L[]>([]);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { id } = current;
        if ( !id ) return;
        const query = async () => {
            const res = await queryLyric(id);
            let arr: Array<string> = res.split('\n');
            let result: Array<L> = [];
            
            arr.map((row: string) => {
                let temp = row.split(/\[(.+?)\]/);
                if ( temp.length === 3) {
                    let t: Array<string> = temp[1].split(':');
                    result.push({ time: Number(t[0]) * 60 + Number(t[1]), content: temp[2] });
                }
            });
            
            setLyric(result);
        }

        query();
        
    }, [current]);

    const cursor = lyric.findIndex((lyr: L) => {
        return lyr.time > time;
    }) - 1 || -1;

    useEffect(() => {
        const $c = container.current;
        const $active: HTMLElement | null | undefined = $c?.querySelector('.current');
        if ( $c && $active ) {
            $c.scrollTo({
                top: $active.offsetTop - $c.offsetHeight / 3,
                behavior: 'smooth'
            });
        }
        
    }, [cursor]);
    

    function lyricStatus (i: number): string {
        if ( i < cursor ) {
            // return 'past';
            return '';
        } else if (i === cursor) {
            return 'current';
        } else {
            return '';
        }
    }

    return <Container ref={ container }>
        {
            lyric.map((line: L, i: number) => {
                return <Line key={ i } className={ lyricStatus(i) }>{ line.content }</Line>
            })
        }
    </Container>
}

export default Lyric;