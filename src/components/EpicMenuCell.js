import React from 'react';
import {
	SimpleCell,
} from '@vkontakte/vkui';

export default ({activeTopic, topic, setActiveTopic, icon, disabled, children}) => {
    const selected = activeTopic === topic;
    return(
        <SimpleCell
        disabled={selected || disabled}
        style={selected && !disabled ? {
            backgroundColor: "var(--button_secondary_background)",
            borderRadius: 8
        } : disabled ? {opacity: '0.4'} : {}}
        onClick={() => setActiveTopic(topic)}
        before={icon}>
            {children}
        </SimpleCell>
    )
}