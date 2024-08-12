import {create} from 'zustand'
import { createAuthSlice } from './slices/auth-slice'
import {createChatSlice} from './slices/chat-slide'


export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)

}))