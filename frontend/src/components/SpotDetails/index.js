import {useParams} from 'react-router-dom';
import './SpotDetails.css';
import { useSelector, useDispatch } from 'react-redux';

const SpotDetails = () => {
    const {spotId} = useParams();
    return (
        <div className='spot-details'>
            <h1>spot {spotId} details</h1>
        </div>
    )
}

export default SpotDetails