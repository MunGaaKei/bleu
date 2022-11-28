import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { add2List, deleteSongFromList, setCurrentSong } from '../store/playlist';
import { TypeSong } from '../store/types';
import { s2min } from '../utils'
import { Toast } from './toast';

const Ellipsis = `
padding: 12px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;`;

const Li = styled.div`
width: var(--width);
max-width: 100%;
border-radius: 4px;
transition: all .15s;
user-select: none;
&:nth-child(odd) {
    background: #ddd;
}
&:hover {
    background: #fafafa;
    .controls {
        opacity: 1;
    }
}
&.row-header {
    pointer-events: none;
    background: none;
    opacity: .4;
}
&.active {
    background: silver;
}
&.no-copyright {
    opacity: .4;
}
`;

const Platform = styled.i`
margin-right: 4px;
font-size: 20px;
line-height: 1;
font-weight: 400;
&.icon-netease-cloud-music-line {
    color: rgb(214,0,26);
}
`;

const Name = styled.b`
flex: 1;
${ Ellipsis }
`;

const Singer = styled.a`
width: 120px;
${ Ellipsis }
`;

const Album = styled.a`
width: 120px;
${ Ellipsis }
`;

const Controls = styled.div`
margin: 0 12px;
width: 40px;
justify-content: center;
opacity: 0;
transition: all .24s;
> .iconfont {
    margin: 0 8px;
    font-size: 20px;
    line-height: 1;
    transition: all .24s;
    color: #6a6a6a;
    &:hover {
        color: #212121;
    }
}
`;

const Duration = styled.span`
padding: 8px 8px;
width: 50px;
text-align: right;
`;

const Vip = styled.i`
margin-right: 8px;
font-size: 20px;
line-height: 16px;
font-weight: 400;
padding: 0 4px;
border-radius: 4px;
border: 1px solid crimson;
background: crimson;
color: #fff;
`;

type props = {
    item: TypeSong,
    header?: boolean,
    controls?: number,  // 1: add    2: delete
    showPlatform?: boolean
}

const Row : React.FC<props> = ({ item, showPlatform, header, controls }) : JSX.Element => {
    let { platform, name, singer, album, duration, id, vip, copyright } = item;
    const dispatch = useAppDispatch();
    const { current } = useAppSelector(state => state.playlist, (p, n) => p.current?.id === n.current?.id);

    const Btns = (): JSX.Element => {
        if ( controls === 1 ) {
            return <a className='iconfont icon-add-to-playlist' onClick={ handleAdd2List }></a>  
        } else if ( controls === 2 ) {
            return <a className='iconfont icon-remove_from_trash' onClick={ () => dispatch(deleteSongFromList(item.id)) }></a>
        } else {
            return <></>
        }
    }

    const handleAdd2List = () => {
        if ( copyright ) {
            dispatch(add2List(item))
        } else {
            noCopyright();
        }
    }

    const handleDblClick = () => {
        if ( copyright ) {
            dispatch(setCurrentSong(item));
            dispatch(add2List(item));
        } else {
            noCopyright();
        }
    }

    const LiClass = (): string => {
        let cls = ['flex'];
        if ( header ) cls.push('row-header');
        if ( current?.id === id ) cls.push('active');
        if ( !copyright ) cls.push('no-copyright');
        return cls.join(' ');
    }

    const noCopyright = () => {
        Toast.push({
            key: 'copyright',
            text: '🥲 该歌曲暂无版权'
        });
    }

    const IconPlatform = (): JSX.Element => {
        if ( platform === 0 ) {
            return <Platform className='iconfont icon-netease-cloud-music-line'></Platform>
        } else {
            return <Platform className='iconfont icon-qqmusic'></Platform>
        }
    }

    duration = typeof duration === 'string'? duration: s2min(Number(duration) / 1000);

    return <Li className={ LiClass() } onDoubleClick={ handleDblClick }>
        <Name title={ name } className="flex">
            {
                showPlatform && IconPlatform()
            }
            {
                vip && <Vip className='iconfont icon-vip'></Vip>
            }
            { name }
        </Name>
        <Singer title={ singer }>{ singer }</Singer>
        <Album title={ album }>{ album }</Album>
        <Controls className='flex controls'>
            <Btns></Btns>
        </Controls>
        <Duration>{ duration }</Duration>
    </Li>
}

export default Row;