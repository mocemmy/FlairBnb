import { csrfFetch } from "./csrf";


const GET_REVIEWS_FOR_SPOT = '/reviews/get_reviews_for_spot';
const GET_REVIEWS_FOR_USER = '/reviews/get_reviews_for_a_user'

const DELETE_REVIEW = '/reviews/delete_review';
const CREATE_REVIEW = '/reviews/create_review';

const actionGetReviewsForSpot = (reviews) => ({
    type: GET_REVIEWS_FOR_SPOT,
    reviews
})

const actionDeleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

const actionCreateReview = (review) => ({
    type: CREATE_REVIEW,
    review
})

const actionGetReviewsForUser = (reviews) => ({
    type: GET_REVIEWS_FOR_USER,
    reviews
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

export const thunkCreateReview = (reviewBody, spotId) => async dispatch => {
    spotId = +spotId;
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewBody)
    });
    if(res.ok){
        const review = await res.json();
        dispatch(actionCreateReview(review))
    } else {
        const errors = await res.json();
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
            newState = { ...state };
            newState.spot = {};
            action.reviews.map(rev => newState.spot[rev.id] = rev);
            return newState;
        case DELETE_REVIEW:
            newState = { ...state }
            delete newState.spot[action.reviewId]
            console.log(state, newState)
            return newState;
        case CREATE_REVIEW: 
            newState = { ...state }
            newState.spot[action.review.id] = action.review;
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