const StarRating = ({spot}) => {
    let avgStars = "new";
    if(spot.avgRating){
        avgStars = parseInt(spot.avgRating).toFixed(2);
    }
    

    return (
        <>
            {spot.avgRating && <p className="star-rating"><i className="fa-solid fa-star"></i>{avgStars}</p>}
            {!spot.avgRating && <p>new</p>}
        </>
    )
}

export default StarRating;