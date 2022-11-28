import styled from "styled-components";
import UserNetcloud from "../components/user-netcloud";

const Line = styled.div`
width: 720px;
max-width: 100%;
margin: 40px auto;
justify-content: center;
> label {
    width: 100px;
    .iconfont {
        font-size: 60px;
    }
}
.qr-image {
    margin: 0 20px;;
}
`;

const Setting : React.FC = () : JSX.Element => {

    return <>
        <Line className="flex">
            <UserNetcloud></UserNetcloud>
        </Line>
    </>
}

export default Setting;