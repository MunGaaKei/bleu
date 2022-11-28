import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface UserInfo {
    id: string,
    name: string,
    vip: boolean,
    avatar: string,
    bio: string,
    gender: number
    background: string
}

enum platform {
    netcloud = 'netcloud',
    qqmusic = 'qqmusic'
}

interface State {
    netcloud: UserInfo | null,
    qqmusic: UserInfo | null
}


const initialState: State = {
    netcloud: null,
    qqmusic: null
}

const reducers = {

    signin: (state: State, { payload }: PayloadAction<{ type: platform, data: UserInfo }>) => {
        const { type, data } = payload;
        state[type] = data;
    },

    signout: (state: State, { payload }: PayloadAction<platform>) => {
        state[payload] = null;
    }

}

const slice = createSlice({
    name: 'user',
    initialState,
    reducers
})

export const playlist = (state: RootState) => state;
export const { signin, signout } = slice.actions;
export default slice.reducer;