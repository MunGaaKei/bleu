import { useState } from 'react';
import styled from 'styled-components';

import Playlist from '../views/playlist';
import Search from '../views/search';
import Comment from '../views/comments';
import Mv from '../views/mv';
import Setting from '../views/setting';

const Navs = styled.div`
box-sizing: border-box;
padding: 12px;
max-width: 100%;
width: var(--width);
`;

const Icon = styled.a`
margin: 0 8px;
font-size: 32px;
font-weight: 400;
color: #a8a8a8;
&.active {
    color: #212121;
}
`;

const Content = styled.div`
flex: 1;
width: 100%;
box-sizing: border-box;
padding: 12px;
overflow-x: hidden;
`;

type Item = {
    name: string,
    icon: string
}

const Tabs : React.FC = () : JSX.Element => {

    const [tab, setTab] = useState<string>('search');
    const icons : Item[] = [
        { name: 'playlist', icon: 'icon-queue-muspx' },
        { name: 'mv', icon: 'icon-video_horizontal' },
        { name: 'search', icon: 'icon-search' },
        { name: 'comment', icon: 'icon-comment_text_outlined' },
        { name: 'setting', icon: 'icon-settings_vs_outlined' }
    ];

    const View = () => {
        switch ( tab ) {
            case 'playlist':
                return <Playlist></Playlist>
            case 'search':
                return <Search></Search>
            case 'comment':
                return <Comment></Comment>
            case 'mv':
                return <Mv></Mv>
            case 'setting':
                return <Setting></Setting>
            default:
                return <></>
        }
    }
    

    return <>
        <Navs className='flex'>
            {
                icons.map((item, i) => {
                    return <Icon key={ item.name }
                        className={ `btn iconfont ${ item.icon } ${ tab === item.name? 'active': '' }` }
                        onClick={ () => setTab(item.name) }></Icon>
                })
            }
        </Navs>
        <Content>
            <View></View>
        </Content>
    </>;
}

export default Tabs;