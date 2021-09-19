import React from 'react';
import {
    SimpleCell,

} from "@vkontakte/vkui"
import {
    Icon28Favorite,
} from "@vkontakte/icons";
import {
    ACTIONS_NORM, 
} from "../config"

export default ({userInfo, setActivePanel, activePanel}) => {
    const genMainChild = () => {
        return(
            <div style={{display: 'flex'}}>
                Вы эксперт
            </div>
        )
    }
    return(
        <SimpleCell
        style={activePanel === 'profile' ? {
            backgroundColor: "var(--button_secondary_background)",
            borderRadius: 8
        } : {}}
        before={
            <Icon28Favorite width={32} height={32} style={{color: userInfo.actions_current_week >= ACTIONS_NORM ? '#FFB230' : '#CCD0D6'}} />
        }
        onClick={() => setActivePanel('profile')}
        description={"В тематике «" + userInfo.topic_name + "»"}>
            {genMainChild()}
        </SimpleCell>
    )
}