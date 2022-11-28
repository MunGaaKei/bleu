import { netcloud } from "./service";
import { SearchQuery, SearchResult, CommentItem } from "./interface";

const NETWORK_ERROR = '🥲 网络似乎出现了问题';

const search = async ({keyword, page = 1, type = 1}: SearchQuery): Promise<SearchResult> => {
    const SIZE = 30;
    const res = await netcloud.get(`/cloudsearch?keywords=${ keyword }&offset=${ SIZE * (page - 1) }&limit=${ SIZE }&type=${ type }`);

    if ( !res.status ) {
        return {
            count: 0,
            songs: [],
            msg: NETWORK_ERROR
        }
    } else {
        let { songs, songCount } = res.data.result;
        songs = songs.map((s: any) => {
            const p = s.privilege;
            return {
                id: s.id,
                name: s.name,
                alias: s.alia.join(''),
                album: s.al.name,
                singer: s.ar.map((item: any) => item.name).join(' & '),
                platform: 0,
                cover: s.al.picUrl,
                duration: s.dt,
                mv: s.mv,
                vip: s.fee === 1,
                copyright: !(p.fee === 0 || p.payed && p.pl > 0 && p.dl === 0) || !(p.dl === 0 && p.pl === 0)
            }
        });
        return {
            count: songCount,
            songs,
            msg: ''
        }
    }
}

const querySong = async (id: string) => {
    const res = await netcloud.get(`/song/url/v1?id=${id}&level=exhigh`);
    if ( res.status === 200 ) {
        const data = res.data.data;
        const { url } = data[0];
        return {
            data: {
                src: url
            },
            msg: ''
        }
    } else {
        return {
            data: null,
            msg: NETWORK_ERROR
        };
    }
}

const queryLyric = async ( id: string) => {
    const res = await netcloud.get(`/lyric?id=${ id }`);

    if ( res.status === 200 ) {
        const { data: { lrc } } = res;
        return lrc.lyric;
    } else {
        return null;
    }
}

const formatComment = (c: any): CommentItem => {
    const beReplied = c.beReplied.map((r: any) : CommentItem => {
        return {
            id: r.beRepliedCommentId,
            user: r.user.nickname,
            userId: r.user.userId,
            avatar: r.user.avatarUrl,
            location: r.ipLocation.location,
            likedCount: 0,
            liked: false,
            content: r.content,
            time: '',
            beReplied: []
        }
    });
    return {
        id: c.commentId,
        user: c.user.nickname,
        userId: c.user.userId,
        avatar: c.user.avatarUrl,
        location: c.ipLocation.location,
        likedCount: c.likedCount,
        liked: c.liked,
        content: c.content,
        time: c.timeStr,
        beReplied
    }
}

const querySongComment = async ( id: string, page: number = 0) => {
    const size = 20;
    const res = await netcloud.get(`/comment/music?id=${id}&offset=${page * size}`);
 
    if ( res.status === 200 ) {
        let { comments, hotComments, total } = res.data;
        comments = comments.map(formatComment);
        hotComments = hotComments?.map(formatComment) || [];
        return {
            comments,
            hotComments,
            total
        };
    } else {
        return null;
    }
}

const queryMv = async (id: string) : Promise<string | null> => {
    const res = await netcloud.get(`/mv/url?id=${id}&r=1080`);
    if ( res.status === 200 ) {
        return res.data.data.url;
    } else {
        return null;
    }
}


const qrCode = async (): Promise<{ qrimg: string, key: string } | null> => {
    let res = await netcloud.get('/login/qr/key');
    if ( res.status !== 200 ) return null;
    const { unikey } = res.data.data;
    res = await netcloud.get(`/login/qr/create?key=${ unikey }&qrimg=true`);
    if (res.status !== 200) return null;
    const { qrimg } = res.data.data;
    return { qrimg, key: unikey };
}

const checkQrCode = async (key: string): Promise<null | {code: number, cookie: string, message: string}> => {
    const res = await netcloud.get(`/login/qr/check?key=${key}&t=${ new Date().getTime() }`);
    if ( res.status === 200 ) {
        return res.data;
    } else {
        return null;
    }
}

const loginStatus = async () => {
    const res = await netcloud.get(`/login/status?t=${ new Date().getTime() }`);
    if ( res.status === 200 ) {
        const { account, profile } = res.data.data;
        return profile ? {
            id: account.id,
            name: profile.nickname,
            bio: profile.signature,
            vip: account.vipType === 10,
            avatar: profile.avatarUrl,
            background: profile.backgroundUrl,
            gender: profile.gender
        }: null;
    } else {
        return null;
    }
}

const logout = async () => {
    return await netcloud.get('/logout');
}

export default {
    search,
    querySong,
    queryLyric,
    querySongComment,
    queryMv,
    qrCode,
    checkQrCode,
    loginStatus,
    logout
}
