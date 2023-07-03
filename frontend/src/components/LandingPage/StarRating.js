const StarRating = ({spot}) => {

    return (
        <>
            {spot.avgRating && <p className="star-rating"><i className="fa-solid fa-star"></i>{spot.avgRating}</p>}
            {!spot.avgRating && <p>new</p>}
        </>
    )
}

export default StarRating;