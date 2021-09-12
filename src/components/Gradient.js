import React from 'react';
import {
	Gradient as VKUIGradient,
    SizeType,
    useAdaptivity,
} from '@vkontakte/vkui';	
const Gradient = props => {
    const sizeX = useAdaptivity().sizeX
    return(
        <VKUIGradient style={{
            margin: sizeX === SizeType.REGULAR ? '-7px -7px 0 -7px' : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 32,
        }}>
            {props.children}
        </VKUIGradient>
    )
}
export default Gradient;