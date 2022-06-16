import React from 'react';
import {
    SimpleCell,

} from "@vkontakte/vkui"


export default ({href, children, Icon, color}) => {
    return(
        <SimpleCell
        expandable
        before={<Icon style={{color: color}} />}
        target="_blank" rel="noopener noreferrer"
        href={href}>
            {children}
        </SimpleCell>
    )
} 