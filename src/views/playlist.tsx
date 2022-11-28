import styled from 'styled-components';
import { useAppSelector } from '../store/hooks';
import { TypeSong } from '../store/types';
import Row from '../components/row';
import Text from '../components/text';
import Lyric from '../components/lyric';

const Container = styled.div`
height: 100%;
`;
const Half = styled.div`
width: 50%;
height: 100%;
overflow-x: hidden;
`;

const Playlist : React.FC = () : JSX.Element => {

    const { list } = useAppSelector(state => state.playlist, (p, n) => p.list.length === n.list.length);

    if ( !list.length ) {
        return <Text text='空的播放列表'></Text>
    }

    return <Container className='flex'>
        <Half>
            <Row item={{ id: '', name: '歌曲名', singer: '歌手', album: '专辑', duration: '时长', vip: false, copyright: true }} header={ true }></Row>
            {
                list.map((s: TypeSong) => {
                    return <Row key={ s.id } item={ s } controls={ 2 } showPlatform={ true }></Row>
                })
            }
        </Half>
        <Half>
            <Lyric></Lyric>
        </Half>
    </Container>
}

export default Playlist;