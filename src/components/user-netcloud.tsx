import { useAppDispatch, useAppSelector } from "../store/hooks";
import styled from "styled-components";
import { netcloudQrCode, netcloudCheckQrCode, netcloudLoginStatus } from "../api";
import { useEffect, useRef, useState } from "react";
import { Toast } from "../components/toast";
import { signin, signout } from "../store/user";

const Avatar = styled.img`
width: 50px;
height: 50px;
border-radius: 4px;
`;

const Userinfo = styled.div`
margin: 0 20px;
`;

const Iconvip = styled.i`
font-size: 24px;
margin-left: 8px;
color: firebrick;
`;

enum platform {
    netcloud = 'netcloud',
    qqmusic = 'qqmusic'
}

const UserNetcloud : React.FC = () : JSX.Element => {
    
    const { netcloud } = useAppSelector(state => state.user, (p, n) => p.netcloud === n.netcloud);
    const dispatch = useAppDispatch();
    const [qrImg, setQrImg] = useState<string>('');
    const qrTimer = useRef<ReturnType<typeof setInterval>>();
    const key = useRef<string>('');

    useEffect(() => {
        if ( netcloud ) return;
        checkStatus();

        const queryNetcloudQrCode = async () => {
            const res = await netcloudQrCode();
            if ( res ) {
                setQrImg(res.qrimg);
                key.current = res.key;
                if ( !qrTimer.current ) {
                    qrTimer.current = setInterval(checkNcQr, 3000);
                }
            }
        }

        !netcloud && queryNetcloudQrCode();

        return () => {
            qrTimer.current && clearInterval(qrTimer.current);
        }
    }, [netcloud]);

    const checkStatus = async () => {
        const status = await netcloudLoginStatus();
        if (status) {
            dispatch(signin({
                type: platform.netcloud,
                data: status
            }));
        } else {
            Toast.push({
                key: 'login',
                text: `🥲 网易云登录信息过期，请重新登录`
            });
            dispatch(signout(platform.netcloud));
            localStorage.setItem('cookie-netcloud', '');
        }
    }

    const checkNcQr = async () => {
        const res = await netcloudCheckQrCode(key.current);
        if ( res ) {
            const { code, message, cookie } = res;
            
            if ( code === 803 ) {
                Toast.push({
                    key: 'login',
                    text: `✌️ ${message}`
                });
                localStorage.setItem('cookie-netcloud', cookie);
                clearInterval(qrTimer.current);
                const status = await netcloudLoginStatus();
                if (status) {
                    dispatch(signin({
                        type: platform.netcloud,
                        data: status
                    }));
                }
            }
        }
    }

    const netcloudStatus = (): JSX.Element => {
        if ( netcloud ) {
            return <div className="flex">
                <Avatar src={ netcloud.avatar } />
                <Userinfo>
                    <h4 className="flex">{ netcloud.name } { netcloud.vip && <Iconvip className="iconfont icon-vip"></Iconvip> }</h4>
                </Userinfo>
                <a className="btn iconfont icon-sign_out" style={{ fontSize: '32px', lineHeight: '20px', marginLeft: 'auto' }}></a>
            </div>
        } else {
            return <>
            {
                qrImg?
                <img src={ qrImg } className="qr-image"></img>:
                <p>检测登录中...</p>
            }
            </>
        }
    }

    return <>
        <label>
            <i className="iconfont icon-netease-cloud-music-line"></i>
        </label>
        { netcloudStatus() }
    </>
}

export default UserNetcloud;