import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { changeMode, updateSongData, setCurrentSong, setPlaytime, setVolume } from '../store/playlist';
import Progress from './progress';
import { s2min } from '../utils';
import { querySong } from '../api'
import { TypeSong } from '../store/types';
import { Toast } from './toast';

const Wrapper = styled.div`
margin: 40px auto 0;
padding: 0 12px;
box-sizing: border-box;
max-width: 100%;
width: var(--width);
border-radius: var(--radius);
align-items: flex-start;
user-select: none;
`;

const Cover = styled.div`
width: 240px;
height: 240px;
background-color: #ddd;
border-radius: var(--radius);
background-size: cover;
`;

const Content = styled.div`
padding: 0 0 0 32px;
flex: 1;
`;

const Singer = styled.h4`
margin: 4px 0;
opacity: .6;
`;

const BtnGroup = styled.div`
margin: 20px -8px 8px;
> a {
    margin-right: 20px;
}
`;

const Btn = styled.a`
width: 60px;
line-height: 48px;
> i {
    font-size: 48px;
}
.icon-mode {
    font-size: 30px;
}
`;

export const audio: HTMLAudioElement = new Audio();

const Player : React.FC = () : JSX.Element => {

    const { current, mode, list, volume } = useAppSelector(state => state.playlist, (p, n) => {
        return p.list.length === n.list.length && p.mode === n.mode && p.current === n.current && p.volume === n.volume;
    });
    const { netcloud } = useAppSelector(state => state.user, (p, n) => p.netcloud === n.netcloud);
    const dispatch = useAppDispatch();
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const refStore = useRef({ list, mode, current });
    
    useEffect(() => {
        audio.volume = volume;
    }, [volume]);

    useEffect(() => {
        refStore.current = {
            list,
            mode,
            current
        }
    }, [list, mode, current]);
    
    useEffect(() => {
        audio.addEventListener('ended', handleNext);
        audio.addEventListener('timeupdate', handleTimeupdate);

        return () => {
            audio.removeEventListener('ended', handleNext);
            audio.removeEventListener('timeupdate', handleTimeupdate);
        }
    }, [audio]);

    useEffect(() => {
        !audio.paused && audio.pause();
        if ( !current ) return;
        
        if ( current.src ) {
            audio.setAttribute('src', current.src);
            audio.play();
        } else {
            const query = async () => {
                const res = await querySong(current.id);
                if ( res.data ) {
                    const { src } = res.data;
                    audio.setAttribute('src', src);
                    dispatch(updateSongData({ id: current.id, src }));
                    audio.play();
                    if ( current.vip && !netcloud?.vip ) {
                        Toast.push({
                            key: 'song',
                            text: '😳 歌曲只能试听30s 或者可以登录平台VIP账户'
                        })
                    }
                } else {
                    Toast.push({
                        key: 'song',
                        text: '🤨 网络似乎出了点状况'
                    })
                }
            }
            query();
        }
        
        setDuration(Number(current.duration));
        
    }, [current]);

    useEffect(() => {
        setPlaying(!audio.paused);
    }, [audio.paused]);


    const ModeIcon = (mode: number): JSX.Element => {
        switch (mode) {
            case 0:
                return <i className='iconfont icon-shuffle icon-mode'></i>
            case 1:
                return <i className='iconfont icon-loop icon-mode'></i>
            default:
                return <i className='iconfont icon-loop-once icon-mode'></i>
        }
    }

    const handleSetVolume = (n: number) => {
        dispatch(setVolume(n))
    }

    const handleSetCurrentTime = (n: number) => {
        audio.currentTime = n;
    }

    const handlePlay = () => {
        if ( audio.paused ) {
            audio.play();
        } else if ( current ) {
            audio.pause();
        } else {
            handleNext();
        }
    }

    const handleNext = async () => {
        const { list, mode, current } = refStore.current;
        const l = list.length;
        
        if ( !l ) {
            return;
        } else if ( l === 1 || mode === 2 ) {
            audio.currentTime = 0;
            audio.play();
        } else {
            const index = current? list.findIndex(s => s.id === current.id): -1;
            const song = getNextSong(index, mode);
            
            dispatch(setCurrentSong(song));
        }
    }

    const handleTimeupdate = () => {
        setCurrentTime(audio.currentTime);
        dispatch(setPlaytime(audio.currentTime));
    }

    const getNextSong = ( c: number = -1, mode: number = 0 ): TypeSong => {
        const l = list.length;
        
        switch (mode) {
            case 1: // cycle one
                return list[c === l - 1? 0: (c + 1)];
            case 2: // cycle list
                return c > -1? list[c]: list[0];
            default: // random
                if ( l === 1 ) return list[0];
                let i = Math.floor(Math.random() * l);
                if ( i === c ) {
                    i = i === l - 1? 0: (i + 1);
                }
                return list[i];
        }
    }

    return <Wrapper className='flex'>
        <Cover style={{ backgroundImage: `url(${current && current.cover})` }}></Cover>
        <Content>
            <h3>{ current? current.name: '歌曲' }</h3>
            <Singer>{ current? current.singer: '歌手' }</Singer>
            <BtnGroup className="flex">
                <Btn className='btn' onClick={ () => dispatch(changeMode()) }>{ ModeIcon(mode) }</Btn>
                <Btn className='btn' onClick={ handlePlay }>
                    {
                        playing?
                        <i className="iconfont icon-pause1"></i>:
                        <i className="iconfont icon-play"></i>
                    }
                </Btn>
                <Btn className='btn' onClick={ handleNext }><i className="iconfont icon-skip_next"></i></Btn>
            </BtnGroup>
            <div className='flex' style={{ maxWidth: "200px", marginBottom: '4px' }}>
                <Btn className='btn' style={{ width: 'unset' }}><i className="iconfont icon-volume_up" style={{ fontSize: '24px' }}></i></Btn>
                <Progress value={ volume } total={ 1 } onSetValue={ handleSetVolume }></Progress>
            </div>
            <div className="flex">
                <span>{ s2min(currentTime) }</span>
                <Progress value={ currentTime } total={ duration / 1000 } onSetValue={ handleSetCurrentTime }></Progress>
                <span>{ current? s2min(duration / 1000) : '00:00' }</span>
            </div>
        </Content>
    </Wrapper>
}

export default Player;