export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_BLOG":
            return {
                ...state,
                [action.key]: action.value
            }
        default:
            return state;
    }
}

export const setValues = (dispatch, key, value) => {
    dispatch({
        type: "SET_BLOG",
        key: key,
        value: value
    });
}