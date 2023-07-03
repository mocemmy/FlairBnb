const GET_ALL_SPOTS = 'spots/get_spots';
const SPOT_DETAILS = 'spots/get_spot_details';

const actionGetSpots = (spots) => ({
    type: GET_ALL_SPOTS,
    spots
})

const actionGetSpotDetails = (spot) => ({
    type: SPOT_DETAILS,
    spot
})

export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    if(res.ok){
        const spotsObj = await res.json();
        const spots = spotsObj.Spots;
        
        dispatch(actionGetSpots(spots));
    }
}

export const thunkGetSpotDetails = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);

    if(res.ok) {
        const spot = await res.json();
        console.log('thunk spot',spot)
        dispatch(actionGetSpotDetails(spot));
    }
}

const initialState = {allSpots: {}, singleSpot: {}}

const spotsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS: {
            newState = { ...state };
            action.spots.forEach(spot => {newState.allSpots[spot.id] = spot});
            return newState;
        }
        case SPOT_DETAILS: {
            newState = { ...state };
            newState.singleSpot = action.spot;
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;