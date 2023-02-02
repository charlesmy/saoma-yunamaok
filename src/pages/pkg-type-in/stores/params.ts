/** @format */
import create from 'zustand'

interface State {
    ids: {[key: string]: boolean}
    addId: (id: string, bool: boolean) => void
    clear: () => void
}
export const useParams = create<State>((set, get) => ({
    ids: {},
    addId(id, bool) {
        set({ids: {...get().ids, [id]: bool}})
        return get().ids
    },
    clear() {
        set({ids: {}})
    },
}))
