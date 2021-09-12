import React from 'react';
import {
	SimpleCell,
} from '@vkontakte/vkui';

export default ({activePanel, activeTopic, topic, setActiveTopic, setActivePanel, icon, disabled, children}) => {
    const selected = activeTopic === topic && activePanel === 'topics';
    return(
        <SimpleCell
        disabled={selected || disabled}
        style={selected && !disabled ? {
            backgroundColor: "var(--button_secondary_background)",
            borderRadius: 8
        } : disabled ? {opacity: '0.4'} : {}}
        onClick={() => {
            if(activePanel !== 'topics') setActivePanel('topics');
            setActiveTopic(topic);
        }}
        before={icon}>
            {children}
        </SimpleCell>
    )
}