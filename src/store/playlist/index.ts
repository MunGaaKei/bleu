import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { TypeSong } from '../types';

interface Playlist {
    list: TypeSong [],
    mode: number    // (0：随机 1：列表循环 2：单曲循环)
    current: TypeSong | null,
    time: number,
    volume: number
}


const initialState: Playlist = {
    list: [],
    mode: 0,
    current: null,
    time: 0,
    volume: .5
}


const reducers = {

    setCurrentSong: (state: Playlist, { payload }: PayloadAction<TypeSong>) => {
        state.current = payload;
    },

    add2List: (state: Playlist, { payload }: PayloadAction<TypeSong>) => {
        const { id } = payload;
        if ( state.list.find(song => song.id === id) ) {
            return;
        } else {
            state.list.push(payload);
        }
    },

    updateSongData: (state: Playlist, { payload }: PayloadAction<{ id: string, src: string }>) => {
        let { id, src } = payload;
        let i = state.list.findIndex(song => song.id === id);
        state.list[i].src = src;
    },

    changeMode: (state: Playlist) => {
        const { mode } = state;
        state.mode = mode === 2? 0: mode + 1;
    },

    deleteSongFromList: (state: Playlist, { payload }: PayloadAction<string>) => {
        let index = state.list.findIndex(song => song.id === payload);
        if ( index >= 0 ) {
            if ( state.current && state.current.id === payload ) {
                let k = state.list.findIndex(s => s.id === payload);
                state.current = state.list[(state.list.length === k + 1)? k - 1: k + 1];
            }
            state.list.splice(index, 1);
        }
    },

    setPlaytime: (state: Playlist, { payload }: PayloadAction<number>) => {
        state.time = payload;
    },

    setVolume: (state: Playlist, { payload }: PayloadAction<number>) => {
        state.volume = payload;
    },
}

const slice = createSlice({
    name: 'playlist',
    initialState,
    reducers
})

export const playlist = (state: RootState) => state;
export const { setCurrentSong, add2List, deleteSongFromList, changeMode, updateSongData, setPlaytime, setVolume } = slice.actions;
export default slice.reducer;