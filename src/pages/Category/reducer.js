
export const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'Cate_SET_STATE':
            const newState = { ...state, ...action.data }
            return newState
            break;
        default:
            return state
    }
}