import { csrfFetch } from "./csrf";
import { thunkGetSpotDetails } from "./spots";

const GET_REVIEWS_FOR_SPOT = '/reviews/get_reviews_for_spot';
const GET_REVIEWS_FOR_USER = '/reviews/get_reviews_for_a_user'

const DELETE_REVIEW = '/reviews/delete_review';
const CREATE_REVIEW = '/reviews/create_review';

const actionGetReviewsForSpot = (reviews, spotId) => ({
    type: GET_REVIEWS_FOR_SPOT,
    reviews,
    spotId
})

const actionDeleteReview = (reviewId, spotId) => ({
    type: DELETE_REVIEW,
    reviewId,
    spotId
})

// const actionCreateReview = (review) => ({
//     type: CREATE_REVIEW,
//     review
// })

const actionGetReviewsForUser = (reviews) => ({
    type: GET_REVIEWS_FOR_USER,
    reviews
})

export const thunkGetRevsForSpot = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if(res.ok){
        const reviews = await res.json();
        dispatch(actionGetReviewsForSpot(reviews.Reviews, spotId));
    }
}

export const thunkDeleteReview = (reviewId, spotId) => async dispatch => {
    const resReview = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })

    if(resReview.ok){
         dispatch(actionDeleteReview(reviewId, spotId))
    }
}


export const thunkCreateReview = (reviewBody, spotId) => async dispatch => {
    spotId = +spotId;
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewBody)
    });
    if(res.ok){
       const review = await res.json();
       console.log(review);
       dispatch(thunkGetRevsForSpot(spotId));
    } else {
        const errors = await res.json();
        console.log(errors);
    }
}

export const thunkGetRevsForUser = (userId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/current`);

    if(res.ok){
        const reviews = await res.json();
        dispatch(actionGetReviewsForUser(reviews.Reviews))
    }
}

const initialState = {spot: {}, user: {}}

const reviewsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS_FOR_SPOT: 
            newState = { ...state, spot: {...state.spot} };
            newState.spot[action.spotId] = {};
            action.reviews.forEach(rev => newState.spot[action.spotId][rev.id] = rev);
            return newState;
        case DELETE_REVIEW:
            newState = { ...state, spot: {...state.spot} }
            delete newState.spot[action.spotId][action.reviewId];
            return newState;
        case GET_REVIEWS_FOR_USER:
            newState = { ...state };
            newState.user = {};
            action.reviews.map(rev =>  newState.user[rev.id] = rev);
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;