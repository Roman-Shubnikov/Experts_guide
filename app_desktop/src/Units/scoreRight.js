import React from 'react';
import {
	Group,
    Avatar,
    Div,
    Counter,
    SimpleCell,
    Spacing,
    

} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { enumerate } from '../functions/tools';
import { Icon16Crown } from '@vkontakte/icons';
import { SCORE_POSITION_COLORS } from '../config';


export const ScoreRight = props => {
    const { 
		user, 
		activeTopic, 
	} = useSelector((state) => state.account)
    const vkInfoUser = user.vk_info;
    const userInfo = user.expert_info;
    const { score: scoreData } = useSelector(state => state.stor);
    const scoreGenerator = () => {
		let render_score = [];
		for(let i=0;i<scoreData[activeTopic].length;i++){
			let user_info = scoreData[activeTopic][i];
			let user_data = scoreData.users_data[user_info.user_id];
			let name = user_data.first_name + " " + user_data.last_name;
			let topic_name = user_info.topic_name;
			let actions_current_week = user_info.actions_current_week;
			render_score.push(
				<SimpleCell
				expandable
				href={'https://vk.com/id' + user_info.user_id}
				target="_blank" rel="noopener noreferrer"
				key={user_info.user_id}
				before={<Avatar src={user_data.photo_max_orig} />}
				description={topic_name + ' · ' + actions_current_week.toLocaleString() + ' ' + enumerate(actions_current_week, ['пост', 'поста', 'постов'])}
				after={<Counter style={{background: SCORE_POSITION_COLORS[i]}}>{i+1}</Counter>}>
					<div style={{display: 'flex'}}>{name} {user_info.is_best && <Icon16Crown className='crown crown_profile' />}</div>
				</SimpleCell>
			)
		}
		return render_score.slice(0,3);
	}
    return(
        <Group header={<SimpleCell disabled description='Обновляется в течение недели'>Общий рейтинг</SimpleCell>}>
			{scoreData === null ? 
			<Div style={{paddingTop: 0, paddingBottom: 0}}>
				{Array(3).fill().map(
				(e,i) => 
				<div className='topics_skeleton' key={i}>
					<Skeleton circle={true} height={48} width={48} />
					<div className='topics_skeleton_items'>
						<Skeleton width={120} height={15} />
						<Skeleton width={100} height={10} />
					</div>
					
				</div>
				)}
				
			</Div>
			
			:
			scoreData && scoreGenerator()}
			<Spacing separator />
			<SimpleCell
				disabled
				before={<Avatar src={vkInfoUser.photo_max_orig} />}
				description={userInfo.topic_name + ' · ' + 
				userInfo.actions_current_week.toLocaleString() + 
				' ' + enumerate(userInfo.actions_current_week, ['пост', 'поста', 'постов'])}
				after={<Counter style={{background: '#70B2FF'}}>{userInfo.position}</Counter>}>
					<div style={{display: 'flex'}}>
						{`${vkInfoUser.first_name} ${vkInfoUser.last_name}`} {userInfo.is_best && <Icon16Crown className='crown crown_profile' />}
					</div>
			</SimpleCell>
		</Group>
    )
}