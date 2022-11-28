import styled from "styled-components";

const Box = styled.div`
margin: 40px auto;
display: flex;
justify-content: center;
font-size: 24px;
font-weight: 500;
`

type props = {
    text: string
}

const Text : React.FC<props> = ({ text }) : JSX.Element => {

    return <Box>{ text }</Box>
}

export default Text;