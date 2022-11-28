import netcloud from "./netcloud"
import { SearchQuery, SearchResult } from "./interface";

const search = async (query: SearchQuery) : Promise<SearchResult> => {
    // if ( query.platform === 0 ) {
    return await netcloud.search(query);
    // }
};


const querySong = async (id: string) => {
    return await netcloud.querySong(id);
}

const queryLyric = async (id: string) => {
    return await netcloud.queryLyric(id);
}

const querySongComment = async (id: string, page: number) => {
    return await netcloud.querySongComment(id, page);
}

const queryMv = async (id: string) => {
    return await netcloud.queryMv(id);
}

const netcloudQrCode = async () => {
    return await netcloud.qrCode();
}

const netcloudCheckQrCode = async (key: string) => {
    return await netcloud.checkQrCode(key);
}

const netcloudLoginStatus = async () => {
    return await netcloud.loginStatus();
}

const netcloudLogout = async () => {
    return await netcloud.logout();
}

export {
    search,
    querySong,
    queryLyric,
    querySongComment,
    queryMv,
    netcloudQrCode,
    netcloudCheckQrCode,
    netcloudLoginStatus,
    netcloudLogout
}