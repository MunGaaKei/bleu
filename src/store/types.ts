export interface TypeSong {
    id: string,
    name: string,
    alias?: string,
    album: string,
    singer: string,
    platform?: number,
    cover?: string,
    duration: number | string,
    mv?: string,
    src?: string,
    lyric?: string[],
    copyright: boolean,
    vip: boolean
}