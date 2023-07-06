const ImageCreator = ({imageUrl}) => {
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
        <div className="secondary-image"
            style={{
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: 'cover'
            }}
        >
        </div>
    )
}   

export default ImageCreator;