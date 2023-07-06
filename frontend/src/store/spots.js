import {csrfFetch} from '../store/csrf';

const GET_ALL_SPOTS = 'spots/get_spots';
const SPOT_DETAILS = 'spots/get_spot_details';
const DELETE_SPOT = 'spots/delete_spot';
const CREATE_SPOT = 'spots/create_spot';
const UPDATE_SPOT = 'spots/update_spot';

const actionGetSpots = (spots) => ({
    type: GET_ALL_SPOTS,
    spots
})

const actionGetSpotDetails = (spot) => ({
    type: SPOT_DETAILS,
    spot
})

export const actionDeleteSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId
})

export const actionCreateSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})

const actionUpdateSpot = (spot) =>({
    type: UPDATE_SPOT,
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
        dispatch(thunkGetSpotsCurrUser());
    } else {
        const error = await res.json()
        console.log(error)
    }
}

export const thunkCreateSpot = (spot, imgBody) => async (dispatch, getState) => {
    const errors = {};
    const res = await csrfFetch('/api/spots', {
        method: "POST",
        body: JSON.stringify(spot)
    })

    if(res.ok){
        const spot = await res.json();
        const imgRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: "POST",
            body: JSON.stringify(imgBody)
        })
        // console.log("SPOT DETAILS", spot);
        if(imgRes.ok) {
            const spotDetailsRes = await csrfFetch(`/api/spots/${spot.id}`);
            if(res.ok){
                const spotDetails = await spotDetailsRes.json();
                dispatch(actionCreateSpot(spotDetails))
                return spot;
            }
            dispatch(thunkGetSpotDetails(spot.id));
        } else {
            errors.createImages = await imgRes.json();

        }
    } else {
        errors.createSpot = await res.json()
    }
}

export const thunkUpdateSpot = (spotId, spotBody, imgBody) => async dispatch => {
    const errors = {};
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(spotBody)
    })
    if(res.ok) {
        const imgRes = await csrfFetch(`/api/spots/${spotId}/images/edit`, {
            method: "PATCH",
            body: JSON.stringify(imgBody)
        })
        console.log("here")
        if(imgRes.ok) {
            const spotRes = await csrfFetch(`/api/spots/${spotId}`);
            if(spotRes.ok){
                const spot = await spotRes.json();
                dispatch(actionUpdateSpot(spot))
            } else {
                errors.getSpot = await spotRes.json()
                console.log(errors)
            }
        } else {
            errors.editImages = await imgRes.json();
            console.log(errors)
        }
    } else {
        errors.editSpot = await res.json();
        console.log(errors)
    }
}

const initialState = {allSpots: {}, singleSpot: {}}

const spotsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type){ 
        case GET_ALL_SPOTS: 
            newState = { ...state };
            newState.allSpots = {};
            action.spots.forEach(spot => {newState.allSpots[spot.id] = spot});
            return newState;
        case SPOT_DETAILS: 
            newState = { ...state };
            newState.singleSpot = {};
            newState.singleSpot = action.spot;
            return newState;
        case DELETE_SPOT: 
            newState = { ...state, allSpots: {...state.allSpots}};
            delete newState.allSpots[action.spotId]
            return newState; 
        case CREATE_SPOT: 
            newState = { ...state, singleSpot: { ...state.singleSpot}, allSpots: {...state.allSpots}};
            newState.singleSpot = action.spot;
            newState.allSpots[action.spot.id] = action.spot;
            return newState;
        case UPDATE_SPOT:
            newState = { ...state };
            newState.singleSpot = action.spot;
            return newState
        default:
            return state;
    }
}

export default spotsReducer;