import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { thunkGetRevsForSpot } from '../../../store/reviews';
import ReviewCreator from "./ReviewCreator";

const RatingsReviews = ({numReviews, avgRating}) => { 
    //fetch reviews from database
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const reviews = Object.values(useSelector(state => state.reviews.spot));

    useEffect(() => {
        dispatch(thunkGetRevsForSpot(spotId))
    }, [dispatch])
    let revCount = numReviews;
    if(!numReviews) revCount = "new"
    console.log(reviews)
    if(!reviews.length) return null;
    return (
        <>
            <h2><i className="fa-solid fa-star"></i>{avgRating} {revCount} reviews</h2>
            {reviews.map(rev => (
                <ReviewCreator key={rev.id} review={rev} />
            ))}
        </>
    )
}
export default RatingsReviews;