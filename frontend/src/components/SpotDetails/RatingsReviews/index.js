import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { thunkGetRevsForSpot } from '../../../store/reviews';
import ReviewCreator from "./ReviewCreator";

const RatingsReviews = () => { 
    //fetch reviews from database
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const reviews = Object.values(useSelector(state => state.reviews.spot));

    useEffect(() => {
        dispatch(thunkGetRevsForSpot(spotId))
    }, [dispatch])

    if(!reviews.length) return null;
    return (
        <>
            {reviews.map(rev => (
                <ReviewCreator key={rev.id} review={rev} />
            ))}
        </>
    )
}
export default RatingsReviews;