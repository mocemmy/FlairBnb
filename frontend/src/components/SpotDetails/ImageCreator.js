const ImageCreator = ({imageUrl}) => {
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