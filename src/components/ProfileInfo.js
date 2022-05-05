import React from 'react';
import {
    Avatar,
    SimpleCell,

} from "@vkontakte/vkui"
import { Cards } from '.';
import { PERMISSIONS } from '../config';
import { Icon28AchievementCircleFillBlue } from '@vkontakte/icons';
export default ({vkInfoUser, userInfo, goPanel, activePanel}) => {
    const permission_activist = userInfo.permissions >= PERMISSIONS.activist;
    const genMainChild = () => {
        return(
            <div style={{display: 'flex'}}>
                {vkInfoUser.first_name + ' ' + vkInfoUser.last_name} {permission_activist && <Icon28AchievementCircleFillBlue className='verified' width={16} height={16} />}
            </div>
        )
    }
    return(
        <div style={{display: 'flex', 
        justifyContent: 'space-between', }}>
            <div style={{width: '50%', height: 65}}>
                <SimpleCell
                style={activePanel === 'profile' ? {
                    width: '50%',
                    height: '100%',
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8
                } : {
                    width: '50%',
                height: '100%',}}
                before={
                    <Avatar className='avatar' 
                    shadow={false} 
                    size={48} 
                    src={vkInfoUser.photo_max_orig} 
                    alt='ava' />
                }
                onClick={() => goPanel('profile', 'profile')}
                description={"Ваша тематика: " + userInfo.expert_info.topic_name}>
                    {genMainChild()}
                </SimpleCell>
            </div>
            
            <Cards />
        </div>
    )
}