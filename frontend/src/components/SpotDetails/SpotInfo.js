const SpotInfo = ({ spot }) => {
    const onClick = () => {
        window.alert("Feature coming soon");
      };
      console.log('spot details:',spot)
  return (
    <>
      <div className="spot-info">
        <h2 className="owner-info">
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>
        <p className="description">{spot.description}</p>
      </div>
      <div className="reserve">
        <div className="price-reviews-container">
          <p>
            <span id="price">${spot.price.toFixed(2)}</span> night
          </p>
          <p id="stars">
            <i className="fa-solid fa-star"></i>{" "}
            {spot.avgStarRating ? (
              <span>{spot.avgStarRating}</span>
            ) : (
              <span>0 </span>
            )}
            <span id="num-revs">-{spot.numReviews}</span>
          </p>
        </div>
        <button className="reserve-button" onClick={onClick}>
          Reserve
        </button>
      </div>
    </>
  );
};


export default SpotInfo;