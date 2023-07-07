import "./CreateSpot.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  actionCreateSpot,
  thunkCreateSpot,
  thunkUpdateSpot,
} from "../../store/spots";

const isValidFileType = (url) => {
  url = `${url}`;
  if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith("jpeg"))
    return true;
  else return false;
};

const CreateUpdateSpotForm = ({ type, defaultValues }) => {
  let header;
  const { spotId } = useParams();
  let buttonText;
  if (type === "create") {
    header = "Create a new Spot";
    buttonText = "Create Spot";
  } else if (type === "update") {
    header = "Update Your Spot";
    buttonText = "Update Spot";
  }

  let countryVal;
  let stateVal;
  let cityVal;
  let addressVal;
  let descriptionVal;
  let nameVal;
  let priceVal;
  let image1Val;
  let image2Val;
  let image3Val;
  let image4Val;
  let previewImageVal;

  if (defaultValues) {
    countryVal = defaultValues.countryVal;
    stateVal = defaultValues.stateVal;
    cityVal = defaultValues.cityVal;
    addressVal = defaultValues.addressVal;
    descriptionVal = defaultValues.descriptionVal;
    nameVal = defaultValues.nameVal;
    priceVal = defaultValues.priceVal;

    [previewImageVal, image1Val, image2Val, image3Val, image4Val] =
      defaultValues.images;
    if (previewImageVal) previewImageVal = previewImageVal.url;
    if (image1Val) image1Val = image1Val.url;
    if (image2Val) image2Val = image2Val.url;
    if (image3Val) image3Val = image3Val.url;
    if (image4Val) image4Val = image4Val.url;
  }
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState(countryVal || "");
  const [address, setAddress] = useState(addressVal || "");
  const [city, setCity] = useState(cityVal || "");
  const [addState, setAddState] = useState(stateVal || "");
  const [description, setDescription] = useState(descriptionVal || "");
  const [title, setTitle] = useState(nameVal || "");
  const [price, setPrice] = useState(priceVal || "");
  const [previewImage, setPreviewImage] = useState(previewImageVal || "");
  const [image1, setImage1] = useState(image1Val || "");
  const [image2, setImage2] = useState(image2Val || "");
  const [image3, setImage3] = useState(image3Val || "");
  const [image4, setImage4] = useState(image4Val || "");
  const [validationErrors, setValidationErrors] = useState({});


  //check validation errors:
  useEffect(() => {
    const errors = {};

    if (!(country.length > 0)) errors.country = "Country is required";
    if (!(address.length > 0)) errors.address = "Address is required";
    if (!(city.length > 0)) errors.city = "City is required";
    if (!(addState.length > 0)) errors.state = "State is required";
    if (!(description.length > 30))
      errors.description = "Description needs 30 or more characters";
    if (!(title.length > 0)) errors.title = "Name is required";
    if (!price) errors.price = "Price is required";
    if (!(previewImage.length > 0))
      errors.previewImage = "Preview image is required";

    if (image1 && !isValidFileType(image1))
      errors.image1 = "Image URL must end in .png, .jpg, or .jpeg";
    if (image2 && !isValidFileType(image2))
      errors.image2 = "Image URL must end in .png, .jpg, or .jpeg";
    if (image3 && !isValidFileType(image3))
      errors.image3 = "Image URL must end in .png, .jpg, or .jpeg";
    if (image4 && !isValidFileType(image4))
      errors.image4 = "Image URL must end in .png, .jpg, or .jpeg";

    setValidationErrors(errors);
  }, [
    country,
    address,
    city,
    addState,
    description,
    title,
    price,
    previewImage,
    image1,
    image2,
    image3,
    image4,
  ]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const spotBody = {
      address,
      city,
      state: addState,
      country,
      lat: 0,
      lng: 0,
      name: title,
      description,
      price: parseInt(price),
    };

    const imageArr = [
      {
        preview: true,
        url: previewImage,
      },
    ];
    if (image1) imageArr.push({ preview: false, url: image1 });
    if (image2) imageArr.push({ preview: false, url: image2 });
    if (image3) imageArr.push({ preview: false, url: image3 });
    if (image4) imageArr.push({ preview: false, url: image4 });

    const imageBody = {
      images: imageArr,
    };
    if (type === "create") {
      const newSpot = await dispatch(thunkCreateSpot(spotBody, imageBody));
      console.log(newSpot);

      history.push(`/spots/${newSpot.id}`);
    } else if (type === "update") {
      dispatch(thunkUpdateSpot(spotId, spotBody, imageBody));
      history.push(`/spots/${spotId}`);
    }
  };

  return (
    <div className="form-container">
      <form className="create-new-spot" onSubmit={(e) => onSubmit(e)}>
          <h1 className="form-title">{header}</h1>
        <div className="location-section">
          <h2 className="form-subtitle" id="location-header">
            Where's your place located?
          </h2>
          <p id="location-subheader">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label htmlFor="country" id="country-label">
            Country
            {validationErrors.country && (
              <p className="errors">&nbsp;{validationErrors.country}</p>
            )}
          </label>

          <input
            name="country"
            className="location-input"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <label htmlFor="street-address" id="address-label">
            Street Address
            {validationErrors.address && (
              <p className="errors">&nbsp;{validationErrors.address}</p>
            )}
          </label>

          <input
            className="location-input"
            name="street-address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="city-state">
            <div className="city">
              <label htmlFor="city">
                City
                {validationErrors.city && (
                  <p className="errors">&nbsp;{validationErrors.city}</p>
                )}
              </label>
              <input
                className="location-input"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="state">
              <label htmlFor="state">
                State
                {validationErrors.state && (
                  <p className="errors">&nbsp;{validationErrors.state}</p>
                )}
              </label>
              <input
                className="location-input"
                name="state"
                placeholder="State"
                value={addState}
                onChange={(e) => setAddState(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="description-section">
          <h2 className="form-subtitle">Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            style={{ resize: "none" }}
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {validationErrors.description && (
            <p className="errors">{validationErrors.description}</p>
          )}
        </div>
        <div className="title-section">
          <h2 className="form-subtitle">Create a title for your spot</h2>
          <p>
            Catch guest's attention with a spot title that highlights what makes
            your place special
          </p>
          <input
            id="title-input"
            placeholder="Name of your spot"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {validationErrors.title && (
            <p className="errors">{validationErrors.title}</p>
          )}
        </div>
        <div className="price-section">
          <h2 className="form-subtitle">Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          <label>
            <h2>$</h2>
            <input
              id="price-input"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          {validationErrors.price && (
            <p className="errors">{validationErrors.price}</p>
          )}
        </div>
        <div className="photos-section">
          <h2 className="form-subtitle">Liven up your spot with photos</h2>
          <p>Submit a link with at least one photo to publish your spot</p>
          <input
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {validationErrors.previewImage && (
            <p className="errors">{validationErrors.previewImage}</p>
          )}
          <input
            placeholder="Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
          {validationErrors.image1 && (
            <p className="errors">{validationErrors.image1}</p>
          )}
          <input
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
          {validationErrors.image2 && (
            <p className="errors">{validationErrors.image2}</p>
          )}
          <input
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
          {validationErrors.image3 && (
            <p className="errors">{validationErrors.image3}</p>
          )}
          <input
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
          {validationErrors.image4 && (
            <p className="errors">{validationErrors.image4}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={Object.keys(validationErrors).length ? true : false}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
export default CreateUpdateSpotForm;
