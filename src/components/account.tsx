import { useAppDispatch, useAppSelector } from "../store/hooks";
import { netcloudLoginStatus } from "../api";
import { signin } from "../store/user";
import { useEffect } from "react";

enum platform {
    netcloud = 'netcloud',
    qqmusic = 'qqmusic'
}

const Accounts : React.FC = () : JSX.Element => {
    const { netcloud } = useAppSelector(state => state.user, (p, n) => p.netcloud === n.netcloud);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if ( netcloud ) return;
        checkStatus();
    }, [netcloud]);

    const checkStatus = async () => {
        const status = await netcloudLoginStatus();
        if (status) {
            dispatch(signin({
                type: platform.netcloud,
                data: status
            }));
        }
    }

    return <></>
}

export default Accounts;