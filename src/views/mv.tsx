import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';
import { queryMv } from '../api';
import { audio } from '../components/player';
import { s2min, fullscreen } from '../utils';
import Progress from '../components/progress';
import Text from '../components/text';

const Container = styled.div`
position: relative;
width: 100%;
height: 100%;
`;

const Video = styled.video`
width: 100%;
height: 100%;
`;

const Controls = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
pointer-events: none;
transition: all .24s;
border-radius: 50%;
width: 60px;
background: rgba(255,255,255,.8);
display: flex;
justify-content: center;
> .iconfont {
    font-size: 60px;
    line-height: 1;
    transform: translateX(2px);
}
&.dimmed {
    opacity: 0;
}
`;

const Bottom = styled.div`
position: absolute;
z-index: 10;
bottom: 0;
left: 0;
right: 0;
padding: 4px 12px;
border-radius: 4px;
background: rgba(255,255,255,1);
`;

const Mv : React.FC = () : JSX.Element => {
    const { current, volume } = useAppSelector(state => state.playlist, (p, n) => {
        return p.current?.id === n.current?.id && p.volume === n.volume;
    } );
    const video = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    if ( !current?.mv ) {
        return <Text text='该歌曲无 MV 播放'></Text>
    }

    useEffect(() => {
        if ( !video.current ) return;
        video.current.volume = volume;
    }, [volume]);
    
    useEffect(() => {
        let v = video.current;
        if ( !v ) return;
        audio.addEventListener('play', handleAudioPlay);
        v.addEventListener('canplay', handleCanplay);
        v.addEventListener('timeupdate', handleTimeupdate);
        return () => {
            if ( !v ) return;
            audio.removeEventListener('play', handleAudioPlay);
            v.removeEventListener('timeupdate', handleTimeupdate);
            v.removeEventListener('canplay', handleCanplay);
            v = null;
        }
    }, [video]);

    useEffect(() => {
        if ( !current || !current.mv ) return;

        const query = async () => {
            const url = await queryMv(current.mv + '');
            if ( url && video.current ) {
                video.current.setAttribute('src', url);
                handlePlay();
            }
        }
        
        query();
        
    }, [current]);

    const handleAudioPlay = () => {
        if ( !audio.paused && video.current ) {
            video.current.pause();
        }
    }

    const handlePlay = () => {
        let v = video.current;
        if ( !v || !current ) return;
        if ( v.paused ) {
            v.play();
            setPlaying(true);
            audio.pause();
        } else {
            v.pause();
            setPlaying(false);
        }
        v = null;
    }

    const handleTimeupdate = () => {
        if ( !video.current ) return;
        setCurrentTime(video.current.currentTime);
    }

    const handleSetCurrentTime = (n: number) => {
        console.log(video.current);
        
        if ( !video.current ) return;
        setCurrentTime(n);
        video.current.currentTime = n;
    }

    const handleCanplay = () => {
        if ( !video.current ) return;
        setDuration(video.current.duration);
    }

    const handleDblClick = () => {
        fullscreen(video.current);
    }

    return <Container>
        <Video ref={ video } onClick={ handlePlay } onDoubleClick={ handleDblClick }></Video>
        <Controls className={ playing? 'dimmed': '' }>
            <a className="iconfont icon-play"></a>
        </Controls>
        <Bottom className='bg-blur flex'>
            <span>{ s2min(currentTime) }</span>
            <Progress value={ currentTime } total={ duration } onSetValue={ handleSetCurrentTime }></Progress>
            <span>{ s2min(duration) }</span>
        </Bottom>
    </Container>
}

export default Mv;