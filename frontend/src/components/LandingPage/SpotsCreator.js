function SpotsCreator ({spot}) {
    console.log(spot)
    return (
        <ul key={spot.id} className='grid-item'>
            <div 
            className="image-container"
            style={{
                backgroundImage: `url(${spot.previewImage})`,
                backgroundSize: 'cover'
            }}
            >
            </div>
            
            <li>{spot.city}</li>
            <li>{spot.state}</li>
        </ul>
    )
}
export default SpotsCreator;