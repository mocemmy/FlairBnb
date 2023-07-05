const GET_REVIEWS_FOR_SPOT = '/reviews/get_reviews_for_spot';

const actionGetReviewsForSpot = (reviews) => ({
    type: GET_REVIEWS_FOR_SPOT,
    reviews
})

export const thunkGetRevsForSpot = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if(res.ok){
        const reviews = await res.json();
        dispatch(actionGetReviewsForSpot(reviews.Reviews));
    }
}

const initialState = {spot: {}, user: {}}

const reviewsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS_FOR_SPOT: 
            newState = { ...state };
            action.reviews.map(rev => newState.spot[rev.id] = rev);
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;