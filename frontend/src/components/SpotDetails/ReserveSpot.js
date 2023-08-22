import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ReserveSpot = ({ spotInfo, spotId }) => {
  const history = useHistory();
    const onClick = () => {
        history.push(`/spots/${spotId}/reserve`)
      };
      const  {price, revCount, avgStars, reviewLabel} = spotInfo;
      let decPrice = parseInt(price).toFixed(2);
  return (
    <div className="reserve-card">
      <div className="price-reviews-container">
        <p>
          <span id="price">${decPrice}</span> night
        </p>
        <div id="stars">
        {revCount > 0 && <h2>
                    <i className="fa-solid fa-star"></i>&nbsp;
                    {avgStars}&nbsp;&#183;&nbsp;{revCount}&nbsp;{reviewLabel}
                </h2> }
                {revCount === 0 && <h2><i className="fa-solid fa-star"></i>&nbsp;{avgStars}</h2>}
        </div>
      </div>
      <button className="reserve-button" onClick={onClick}>
        Reserve
      </button>
    </div>
  );
};

export default ReserveSpot;
