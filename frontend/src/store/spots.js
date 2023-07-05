import {csrfFetch} from '../store/csrf';

const GET_ALL_SPOTS = 'spots/get_spots';
const SPOT_DETAILS = 'spots/get_spot_details';
const DELETE_SPOT = 'spots/delete_spot';

const actionGetSpots = (spots) => ({
    type: GET_ALL_SPOTS,
    spots
})

const actionGetSpotDetails = (spot) => ({
    type: SPOT_DETAILS,
    spot
})

const actionDeleteSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId
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
        dispatch(actionGetSpotDetails(spot));
    }
} 

export const thunkGetSpotsCurrUser = () => async dispatch => {
    const res = await fetch('/api/spots/current')

    if(res.ok) {
        const spots = await res.json();
        dispatch(actionGetSpots(spots.Spots))
    }
};

export const thunkDeleteSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    if(res.ok) {
        dispatch(actionDeleteSpot(spotId));
    } else {
        const error = await res.json()
        console.log(error)
    }
}

const initialState = {allSpots: {}, singleSpot: {}}

const spotsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS: {
            newState = { ...state };
            newState.allSpots = {};
            action.spots.forEach(spot => {newState.allSpots[spot.id] = spot});
            return newState;
        }
        case SPOT_DETAILS: {
            newState = { ...state };
            newState.singleSpot = {};
            newState.singleSpot = action.spot;
            return newState;
        }
        case DELETE_SPOT: {
            newState = { ...state };
            delete newState.allSpots[action.spotId]
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;