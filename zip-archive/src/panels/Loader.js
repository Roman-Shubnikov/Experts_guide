import React from 'react';
import { 
	Panel,
	ScreenSpinner
} from '@vkontakte/vkui';

export default props => {
    return(
        <Panel id={props.id}>
            <ScreenSpinner />
        </Panel>
    )
}