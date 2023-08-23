import ImageCreator from "./ImageCreator";
import { useModal } from "../../context/Modal";
import ImageSliderModal from "../ImageSliderModal";


const SpotImages = ({imageArr}) => {
  const { setModalContent} = useModal();

  const openSlideshow = (e, currImage) => {
    setModalContent(<ImageSliderModal imageArr={imageArr} currImage={currImage}  />)
  }
 
  if(!imageArr) return <h1>image creator did not load</h1>;
    return (
        <>
        <div className="main-image" onClick={e => openSlideshow(e, 0)}
            style={{
                backgroundImage: `url("${imageArr[0].url}")`,
                backgroundSize: 'cover'
            }}
        >
        </div>
        <div className="secondary-image-container">
          {imageArr.slice(1).map((img, idx) => (
            <ImageCreator key={img.id} openSlideshow={openSlideshow} imageUrl={img.url} idx={idx + 1} />
          ))}
        </div>
        </>
    )
}

export default SpotImages;