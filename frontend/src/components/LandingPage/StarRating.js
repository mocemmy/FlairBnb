const StarRating = ({spot}) => {
    let avgStars = "new";
    console.log('spot', spot)
    if(spot.avgStarRating){
        avgStars = (+spot.avgStarRating).toFixed(2);
    }
    

    return (
        <>
            {spot.avgStarRating && <p className="star-rating"><i className="fa-solid fa-star">&nbsp;</i>{avgStars}</p>}
            {!spot.avgStarRating && <p>New</p>}
        </>
    )
}

export default StarRating;