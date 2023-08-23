
const ImageCreator = ({imageUrl, idx, openSlideshow }) => {

    if(!imageUrl) return (
        <div className="secondary-image"
            style={{
                backgroundColor: "gray",
                backgroundSize: 'cover'
            }}
        >
        </div>
    )
    return (
        <div className="secondary-image" onClick={e => openSlideshow(e, idx)} 
            style={{
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: 'cover'
            }}
        >
        </div>
    )
}   

export default ImageCreator;