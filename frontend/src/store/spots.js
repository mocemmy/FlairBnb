const GET_ALL_SPOTS = 'spots/get_spots';

const actionGetSpots = (spots) => ({
    type: GET_ALL_SPOTS,
    spots
})

export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    if(res.ok){
        const spotsObj = await res.json();
        const spots = spotsObj.Spots;
        
        dispatch(actionGetSpots(spots));
    }
}
const initialState = {}

const spotsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS: {
            newState = { ...state };
            action.spots.forEach(spot => {newState[spot.id] = spot});
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;