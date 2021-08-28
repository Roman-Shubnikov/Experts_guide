import React, { useState } from 'react';
import {
    Div, 
    SimpleCell,
    Spacing,
    Progress,
    usePlatform,
    VKCOM,
    IconButton,

} from "@vkontakte/vkui"
import {
    Icon12Chevron,
    Icon28Favorite,
    Icon28InfoCircleOutline,
} from "@vkontakte/icons";
import {
    ACTIONS_NORM, 
    BASE_ARTICLE_TOPIC_LINK, 
    GENERAL_LINKS, 
    TOPICS,
} from "../config"
import { enumerate, getKeyByValue } from '../functions/tools';

export default ({userInfo, actsWeek, vkInfoUser}) => {
    const [mouseOndescr, setMouseOndescr] = useState(false);
    const platform = usePlatform();
    const UserDescriptionGen = () => {
		if(userInfo === null) return;
        let pack;
        if(platform === VKCOM){
            pack = <div 
            style={{display:'flex'}}>
                {userInfo.topic_name} <Icon12Chevron className='profile-chevron' style={mouseOndescr ? { transform: 'translateX(2px)'} : {}} />
            </div>
        } else {
            pack = <div 
            style={{display:'flex'}}>
                {userInfo.actions_current_week.toLocaleString() + 
                ' ' + 
                enumerate(userInfo.actions_current_week, ['оценённый', 'оценённых', 'оценённых'])+
                ' постов'} · {userInfo.topic_name} <Icon12Chevron className='profile-chevron' />
            </div>
        }
		return pack;
	}
    const genMainChild = () => {
        if(platform === VKCOM){
            return `${vkInfoUser.first_name} ${vkInfoUser.last_name}`
        } else {
            return(
                <div style={{marginBottom: 12, width: '100%'}}>
                    <div style={{marginBottom: 12}}>
                        Вы эксперт
                    </div>
                    <Progress 
                    style={{width: '100%'}}
                    className={(actsWeek >= ACTIONS_NORM) ? 'green_progressbar' : 'blue_progressbar'}
                    value={actsWeek / ACTIONS_NORM *100}
                    />
                </div>
            )
        }
    }
    return(<>
        <SimpleCell
        className='child_90'
        before={
            <Icon28Favorite width={32} height={32} style={{color: userInfo.actions_current_week >= ACTIONS_NORM ? '#FFB230' : '#CCD0D6'}} />
        }
        after={
            platform !== VKCOM &&
            <IconButton
            href={GENERAL_LINKS.theme_feed}
            target="_blank" rel="noopener noreferrer">
                <Icon28InfoCircleOutline width={24} height={24} style={{color: '#B8C1CC'}} />
            </IconButton>
        }
        hasHover={false}
        hasActive={false}
        href={BASE_ARTICLE_TOPIC_LINK + getKeyByValue(TOPICS, userInfo.topic_name)}
        target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setMouseOndescr(true)} 
        onMouseLeave={() => setMouseOndescr(false)}
        description={UserDescriptionGen()}>
            {genMainChild()}
        </SimpleCell>
        {userInfo && platform === VKCOM && 
        <>
        <Spacing separator />
        <Div>
            <div className='infoblock'>
                Вы оценили <span style={{color: 'black', fontWeight: 550}}>{userInfo.actions_current_week} {enumerate(userInfo.actions_current_week, ['запись', 'записи', 'записей'])}</span> на этой неделе
            </div>
            <Progress 
            className={(actsWeek >= ACTIONS_NORM) ? 'progressbar_big_height green_progressbar' : 'progressbar_big_height blue_progressbar'}
            value={actsWeek / ACTIONS_NORM *100}
            />
            <div className='infoblock' 
            style={{textAlign: 'right', 
            marginBottom: 0, 
            marginTop: 14}}>
                {ACTIONS_NORM}
            </div>
        </Div></>}</>
    )
}