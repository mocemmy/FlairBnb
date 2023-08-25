import { useState, useEffect } from "react";
import "./ImageSliderModal.css";

function ImageSliderModal({ imageArr, currImage }) {
  const [moreImagesLeft, setMoreImagesLeft] = useState(
    currImage > 0 ? true : false
  );
  const [moreImagesRight, setMoreImagesRight] = useState(
    currImage < imageArr.length - 1 ? true : false
  );
  const [current, setCurrent] = useState(currImage);

  const previousImage = () => {
    if (current > 0) {
      const curr = current - 1;
      setCurrent(curr);
      setMoreImagesRight(true);
      if (curr === 0) {
        setMoreImagesLeft(false);
      }
    } else {
      setMoreImagesLeft(false);
    }
  };

  const nextImage = () => {
    if (current < imageArr.length - 1) {
      const curr = current + 1;
      setCurrent(curr);
      setMoreImagesLeft(true);
      if (curr === imageArr.length - 1) {
        setMoreImagesRight(false);
      }
    } else {
      setMoreImagesRight(false);
    }
  };

  return (
    <div className="slideshow-container">
      <h1>Spot Images</h1>
      {imageArr.map((img, idx) => (
        <div
          className={idx === current ? "selected slide" : "slide"}
          key={img.id}
        >
          {idx === current && (
            <img src={img.url} alt="spot image" className="image" />
          )}
        </div>
      ))}
      <div className="small-button-container">
        <button disabled={!moreImagesLeft} onClick={previousImage}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button disabled={!moreImagesRight} onClick={nextImage}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default ImageSliderModal;
