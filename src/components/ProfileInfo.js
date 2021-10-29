import React from 'react';
import {
    Avatar,
    SimpleCell,

} from "@vkontakte/vkui"
import { 
    Icon12Favorite
} from '@vkontakte/icons';
import { ACTIONS_NORM } from '../config';
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
            <Avatar className='avatar' shadow={false} size={48} src={vkInfoUser.photo_max_orig} alt='ava'>
                <div className='avatar_star-container'>
                    <Icon12Favorite 
                    width={11} 
                    height={11}
                    className='avatar_star-icon' 
                    style={{color: userInfo.actions_current_week >= ACTIONS_NORM ? '#FFB230' : '#CCD0D6', marginRight: 12}} />
                </div>
            </Avatar>
        }
        onClick={() => goPanel('profile', 'profile')}
        description={"В тематике «" + userInfo.topic_name + "»"}>
            {genMainChild()}
        </SimpleCell>
    )
}