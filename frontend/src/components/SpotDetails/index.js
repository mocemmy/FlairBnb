import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./SpotDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpotDetails } from "../../store/spots";
import Loading from "../Loading";

const SpotDetails = () => {
    console.log("loaded spot details component")
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spots.singleSpot);

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch]);

  const onClick = () => {
    window.alert("Feature coming soon");
  };

  if (!spotDetails.id) return <Loading />;
  return (
    <div className="spot-details">
      <div className="spot-header-container">
        <h1>{spotDetails.name}</h1>
        <p className="location">
          <span>
            {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
          </span>
        </p>
      </div>
      <div className="images-container">
        <div
          className="main-image"
          style={{
            backgroundImage: `url(${spotDetails.SpotImages[0].url})`,
            backgroundSize: "cover",
          }}
        />
        <div className="image-grid">
          {spotDetails.SpotImages[1] && (
            <div
              style={{
                backgroundImage: `url(${spotDetails.SpotImages[1].url})`,
                backgroundSize: "cover",
              }}
              className="secondary-image"
            />
          )}
          {spotDetails.SpotImages[2] && (
            <div
              style={{
                backgroundImage: `url(${spotDetails.SpotImages[2].url})`,
                backgroundSize: "cover",
              }}
              className="secondary-image"
            />
          )}
          {spotDetails.SpotImages[3] && (
            <div
              className="secondary-image"
              style={{
                backgroundImage: `url(${spotDetails.SpotImages[3].url})`,
                backgroundSize: "cover",
              }}
            />
          )}
          {spotDetails.SpotImages[4] && (
            <div
              style={{
                backgroundImage: `url(${spotDetails.SpotImages[4].url})`,
                backgroundSize: "cover",
              }}
              className="secondary-image"
            />
          )}
        </div>
      </div>
      <div className="spot-info-container">
        <div className="spot-info">
          <h2 className="owner-info">
            Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
          </h2>
          <p className="description">{spotDetails.description}</p>
        </div>
        <div className="reserve">
            <div className="price-reviews-container">
          <p>
            <span id="price">${spotDetails.price}</span> night
          </p>
          <p id="stars"><i className="fa-solid fa-star"></i> {spotDetails.avgStarRating ? <span>{spotDetails.avgStarRating}</span> : <span>0 </span>}
          <span id='num-revs'>-{spotDetails.numReviews}</span>
          </p>
            </div>
          <button className="reserve-button" onClick={onClick}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
