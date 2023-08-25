import { TailSpin } from 'react-loader-spinner'
import './Loading.css'


function Loading(){
    return (
        <div className='loader-container'>
            <TailSpin color="#333" height={20} width={20} />
        </div>
    )
}

export default Loading;