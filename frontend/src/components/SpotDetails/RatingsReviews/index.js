import ReviewCreator from "./ReviewCreator";
import './RatingsReviews.css';
import OpenModalButton from "../../OpenModalButton";
import PostReview from "./PostReview";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetRevsForSpot } from "../../../store/reviews";
import Loading from "../../Loading";

const RatingsReviews = ({user, spotId}) => { 
    const dispatch = useDispatch();
    const reviewsObj = useSelector((state) => state.reviews.spot);
    let alreadyReviewed = false;
    
    useEffect(() => {
        dispatch(thunkGetRevsForSpot(spotId));
    }, [dispatch])
    
    if(!Object.keys(reviewsObj).length) return <Loading />
    const reviews = Object.values(reviewsObj[spotId]);
    if(reviews) reviews.forEach(rev => {
        if(rev.User.id === user.id) alreadyReviewed = true;
    })
    const revCount = reviews.length;
    const numStars = reviews.reduce((acc, curr) => curr.stars + acc, 0);
    let avgStars = "new";
    if(revCount > 0) {
        console.log(numStars, revCount);
        avgStars = numStars/revCount;
    }
    let reviewLabel= "reviews";
    console.log(avgStars);
    // if(revCount = 1) reviewLabel = "review";
    return (
        <>
            <h2>
                <i className="fa-solid fa-star"></i>
                {avgStars}&nbsp;{revCount}&nbsp;{reviewLabel}
            </h2>
            {revCount === 0 &&<p>No reviews yet</p>}
            {user && !alreadyReviewed && 
            (
                <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<PostReview spotId={spotId} />}
                />
            )}
            {reviews.map(rev => (
                <ReviewCreator key={rev.id} review={rev} />
            ))}
        </>
    )
}

/*
<div className="reviews-container">
        <h2>
          <i className="fa-solid fa-star"></i>
          {avgStars} {revCount} reviews
        </h2>
        {revCount === 0 && <p>No reviews yet</p>}
        {user && !alreadyReviewed && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReview spotId={spotId} />}
          />
        )}
        {spotReviews[spotId].map(rev => (
          <ReviewCreator key={rev.id} review={rev}
          />
        ))}
        
      </div>
*/
export default RatingsReviews;