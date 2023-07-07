const ReserveSpot = ({ spotInfo }) => {
    const onClick = () => {
        window.alert("Feature coming soon");
      };
      const  {price, revCount, avgStars, reviewLabel} = spotInfo;
      let decPrice = parseInt(price).toFixed(2);
  return (
    <div className="reserve-card">
      <div className="price-reviews-container">
        <p>
          <span id="price">${decPrice}</span> night
        </p>
        <p id="stars">
        {revCount > 0 && <h2>
                    <i className="fa-solid fa-star"></i>&nbsp;
                    {avgStars}&nbsp;&#183;&nbsp;{revCount}&nbsp;{reviewLabel}
                </h2> }
                {revCount === 0 && <h2><i className="fa-solid fa-star"></i>&nbsp;{avgStars}</h2>}
        </p>
      </div>
      <button className="reserve-button" onClick={onClick}>
        Reserve
      </button>
    </div>
  );
};

export default ReserveSpot;
