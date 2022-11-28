import styled from 'styled-components';
import Player from '../components/player';
import Tabs from '../components/tabs';

const Container = styled.div`
position: relative;
height: 100vh;
overflow: hidden;
flex-direction: column;
`;

const Page: React.FC = () : JSX.Element => {
    return <Container className='flex'>
        <Player></Player>
        <Tabs></Tabs>
    </Container>
}

export default Page;