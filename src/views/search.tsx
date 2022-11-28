import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Row from '../components/row';
import { TypeSong } from '../store/types';
import { search } from '../api';
import Pagination from '../components/pagination';
import Text from '../components/text';
import { Toast } from '../components/toast';

const H = styled.div`
position: sticky;
top: -12px;
z-index: 1;
display: flex;
align-items: center;
max-width: var(--width);
margin: 0 auto;
border-radius: 4px;
background: rgba(255,255,255,.8);
backdrop-filter: blur(24px);
`;

const Btn = styled.button`
background: transparent;
padding: 8px 12px;
border-radius: 0 4px 4px 0;
cursor: pointer;
letter-spacing: 0;
text-align: center;
> .iconfont {
    font-size: 20px;
    line-height: 1;
}
`;

const Input = styled.input`
background: transparent;
flex: 1;
padding: 8px 20px;
outline: none;
border-radius: 4px;
color: #212121;
`;

const Result = styled.div`
max-width: 100%;
width: var(--width);
margin: 12px auto;
`;

const PlatformIcon = styled(Btn)`
margin: 0 0 0 12px;
padding: 0;
font-weight: 400;
line-height: 24px;
height: 24px;
width: 24px;
border-radius: 50px;
transition: none;
> i {
    line-height: 1;
    font-size: 28px;
}
&.qqmusic {
    background: rgb(253,218,0);
    color: rgb(22,189,16);
}
&.netcloud {
    background: rgb(214,0,26);
    color: #fff;
}
`;

const Search : React.FC = () : JSX.Element => {
    const [list, setList] = useState<TypeSong[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [platform, setPlatform] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);
    const [searching, setSearching] = useState<boolean>(false);

    useEffect(() => {
        if ( !searching ) return;
        const query = async () => {
            const res = await search({
                keyword,
                platform,
                page
            });
            
            if ( res.msg ) {
                Toast.push({
                    key: 'search',
                    text: res.msg
                })
            } else {
                setList(res.songs);
                setCount(res.count);
            }
            
            setSearching(false);
        }

        query();
        
    }, [searching]);

    const handleSearch = () => {
        keyword && setSearching(true);
    }

    const handleEnter = (e: { keyCode: number; }) => {
        e.keyCode === 13 && handleSearch();
    }

    const handlePageClick = (p: number) => {
        setPage(p);
        setSearching(true);
    }

    const List = (): JSX.Element => {
        if ( searching ) {
            return <Text text={ '搜索中' }></Text>
        } else if ( list.length ) {
            return <>
                <Row item={{ id: '', name: '歌曲名', singer: '歌手', album: '专辑', duration: '时长', vip: false, copyright: true }} header={ true }></Row>
                {
                    list.map((s: TypeSong) => {
                        return <Row key={ s.id }
                            item={ s }
                            controls={ 1 }></Row>
                    })
                }
                <Pagination page={ page } total={ Math.ceil( count / 30) } onPageClick={ handlePageClick }></Pagination>
            </>
        } else {
            return <></>
        }
    }

    return <>
        <H>
            <PlatformIcon className={ `btn ${ platform === 0? 'netcloud': 'qqmusic' }` } onClick={ () => setPlatform(1 - platform) }>
                {
                    platform === 0?
                    <i className="iconfont icon-netease-cloud-music-line"></i>:
                    <i className="iconfont icon-qqmusic"></i>
                }
            </PlatformIcon>
            <Input value={ keyword }
                onChange={ e => setKeyword(e.target.value) }
                placeholder="..."
                onKeyUp={ handleEnter }></Input>
            <Btn className='btn' onClick={ handleSearch }><i className='iconfont icon-search'></i></Btn>
        </H>
        <Result>
            <List></List>
        </Result>
    </>
}

export default Search;