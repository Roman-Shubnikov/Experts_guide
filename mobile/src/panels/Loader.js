import React from 'react';
import { 
	Panel,
	ScreenSpinner
} from '@vkontakte/vkui';

export const Loader = props => {
    return(
        <Panel id={props.id}>
            <ScreenSpinner />
        </Panel>
    )
}