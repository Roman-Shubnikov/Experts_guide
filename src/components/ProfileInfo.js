import React from 'react';
import {
    Avatar,
    SimpleCell,

} from "@vkontakte/vkui"
export default ({vkInfoUser, userInfo, goPanel, activePanel}) => {
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
            <Avatar size={48} src={vkInfoUser.photo_max_orig} alt='ava' />
        }
        onClick={() => goPanel('profile', 'profile')}
        description={"В тематике «" + userInfo.topic_name + "»"}>
            {genMainChild()}
        </SimpleCell>
    )
}