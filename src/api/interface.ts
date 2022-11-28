import { TypeSong } from '../store/types';

export interface SearchQuery {
    keyword: string,
    platform?: number,
    page?: number,
    type?: number
}

export interface SearchResult {
    count: number,
    songs: TypeSong[],
    msg: string
}

export interface CommentItem {
    id: number,
    user: string,
    userId: number,
    avatar: string,
    location: string,
    liked: boolean,
    likedCount: number,
    content: string,
    time: string,
    beReplied: any []
}