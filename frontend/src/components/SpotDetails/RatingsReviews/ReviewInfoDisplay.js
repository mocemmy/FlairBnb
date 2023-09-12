import "./ReviewInfoDisplay.css";

const ReviewInfoDisplay = ({ spot }) => {
  const stars = [1, 2, 3, 4, 5];
  const filledStar = "fa-solid fa-star";
  const emptyStar = "fa-regular fa-star";
  const halfStar = "fa-solid fa-star-half-stroke";

  const avgRating = (+spot.avgStarRating).toFixed(2);
  const revCount = +spot.numReviews;

  return (
    <div className="review-info-display-container">
      {revCount === 0 && (
        <div className="review-info">
          <p id="stars">
            {stars.map((num) => (
              <i key={num} className={emptyStar} />
            ))}
          </p>
          <p className="rating-tag">new</p>
        </div>
      )}
      {revCount !== 0 && (
        <div className="review-info">
          <p id="stars">
            {stars.map((num) => (
              <i
                key={num}
                className={
                  avgRating >= num
                    ? filledStar
                    : num - avgRating < 1
                    ? halfStar
                    : emptyStar
                }
              />
            ))}
          </p>
          <p className="rating-tag">
            {avgRating} -&nbsp;
            {revCount !== 1 ? (
              <span>{revCount} reviews</span>
            ) : (
              <span>{revCount} review&nbsp;</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewInfoDisplay;
