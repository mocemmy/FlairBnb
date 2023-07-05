import { csrfFetch } from "./csrf";


const GET_REVIEWS_FOR_SPOT = '/reviews/get_reviews_for_spot';

const DELETE_REVIEW = '/reviews/delete_review';

const actionGetReviewsForSpot = (reviews) => ({
    type: GET_REVIEWS_FOR_SPOT,
    reviews
})

const actionDeleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

export const thunkGetRevsForSpot = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if(res.ok){
        const reviews = await res.json();
        dispatch(actionGetReviewsForSpot(reviews.Reviews));
    }
}

export const thunkDeleteReview = (reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })

    if(res.ok){
        dispatch(actionDeleteReview(reviewId));
    }
}

const initialState = {spot: {}, user: {}}

const reviewsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS_FOR_SPOT: 
            newState = { ...state };
            newState.spot = {};
            action.reviews.map(rev => newState.spot[rev.id] = rev);
            return newState;
        case DELETE_REVIEW:
            newState = { ...state }
            delete newState.spot[action.reviewId]
            console.log(state, newState)
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;