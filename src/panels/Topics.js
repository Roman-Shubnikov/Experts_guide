import React, { useEffect, useState } from 'react';
import { 
	Panel, 
	Button, 
	Group, 
	SimpleCell, 
	Placeholder,
	RichCell,
	Avatar,
	Div,
	ScreenSpinner,
	Counter,
	usePlatform,
	VKCOM,
	Link,
	Tabs,
	HorizontalScroll,
	TabsItem,
	PanelHeader,
	PanelHeaderButton,
	FixedLayout,
	IconButton,
	Spacing,
	CellButton,

} from '@vkontakte/vkui';
import {
	Icon56ErrorTriangleOutline,
	Icon16Verified,
	Icon16Like,
	Icon28BrainOutline,
	Icon28VideoCircleOutline,
	Icon28DoorArrowLeftOutline,
	Icon16Crown,
	Icon28HomeOutline,
} from '@vkontakte/icons'
import experts_community from '../img/experts_community.png'
import {
	API_URL,
	GENERAL_LINKS, 
	GROUP_DESCRIPTIONS, 
	SCORE_POSITION_COLORS, 
	TOPICS 
} from '../config';
import {
	enumerate, 
	getKeyByValue,
} from '../functions/tools';
import { ExpertMenu, MenuArticles } from '../components';
import easterEggMusic from '../music/riversolo.mp3'
export default props => {
	const [scoreData, setScoreData] = useState(null);
	const [heartClicks, setHeartClicks] = useState(0);
	const [showPlayer, setShowPlayer] = useState(false);
	const [audio, setAudio] = useState(null);
	const [audioPaused, setAudioPaused] = useState(true);
	const platform = usePlatform();
	const setActiveTopic = props.setActiveTopic;
	const scoreGenerator = () => {
		let render_score = [];
		for(let i=0;i<scoreData[props.activeTopic].length;i++){
			let user_info = scoreData[props.activeTopic][i];
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
		return render_score;
	}
	const genTabs = () => {
		let render_tabs = [];
		let topics = props.getActualTopic();
		for(let i=0;i<topics.length;i++){
			let current_topic = getKeyByValue(TOPICS, topics[i].topic);
			render_tabs.push(
				<TabsItem
				key={current_topic}
				onClick={() => setActiveTopic(current_topic)}
				selected={current_topic === props.activeTopic}>
					{topics[i].topic}
				</TabsItem>
			)
		}
		return(<>
			<div style={{height: 50}}></div>
			<FixedLayout className='mobile_tabs' vertical="top" filled>
				<Tabs mode='buttons'>
					<HorizontalScroll>
						{render_tabs}
					</HorizontalScroll>
				</Tabs>
			</FixedLayout>
			
		</>)
		
	}
	const playAudio = () => {
		if(!audio.paused){
			audio.pause()
		} else {
			audio.volume = 0.2;
			const audioPromise = audio.play()
			if (audioPromise !== undefined) {
			audioPromise
				.then(_ => {
				// autoplay started
				
				})
				.catch(err => {
				// catch dom exception
				console.info(err)
				})
			}
		}
		setAudioPaused(audio.paused);
	}
	
	const easterEggCounter = () => {
		if(heartClicks > 10) {setShowPlayer(true);return};
		setHeartClicks(prev => prev+1)
	}
	useEffect(() => {
		setAudio(new Audio(easterEggMusic));
		if(props.isExpert){
			fetch(API_URL + 'method=experts.getTop&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				data = data.response
				let sliced_data = {}
				for(let i =0; i<data.keys.length;i++) {
					sliced_data[getKeyByValue(TOPICS, data.keys[i])] = data[data.keys[i]].slice(0,3);
				}
				sliced_data['users_data'] = data.users_data;
				setScoreData(sliced_data)
			})
			.catch(err => console.log(err))
		}
		return () => {
			setAudio(null)
		}
	}, [props.isExpert])
	return(
	<Panel id={props.id}>
		{platform !== VKCOM && <PanelHeader
		left={
			props.isExpert ? <PanelHeaderButton
			href={GENERAL_LINKS.experts_card}
			target="_blank" rel="noopener noreferrer">
				<Icon28BrainOutline />
			</PanelHeaderButton>
			: 
			<PanelHeaderButton
			href={GENERAL_LINKS.group_official_community}
			target="_blank" rel="noopener noreferrer">
				<Icon28DoorArrowLeftOutline />
			</PanelHeaderButton>
		}>{props.isExpert === null ? '...' : props.isExpert ? 'Тематики' : 'Доступ закрыт'}</PanelHeader>}
		{props.isExpert === null ? <ScreenSpinner /> : props.isExpert || 
		<Group>
			<Placeholder
			icon={<Icon56ErrorTriangleOutline />}
			action={
					<Button
					size='m'
					mode='tertiary'
					href={GENERAL_LINKS.who_experts}
					target="_blank" rel="noopener noreferrer">
						Кто такие эксперты?
					</Button>
				
			}>
				Вы не являетесь экспертом ВКонтакте
			</Placeholder>
		</Group>
		
		}
		{props.isExpert === null ? <ScreenSpinner /> : props.isExpert &&
		<>
		{platform !== VKCOM && genTabs()}
		{platform === VKCOM && <Group>
			<CellButton
			centered
			onClick={() => props.setActivePanel('home')}
			before={<Icon28HomeOutline />}>
				Главная
			</CellButton>
		</Group>}
		<ExpertMenu
		activeTopic={props.activeTopic} />
		<Group header={<SimpleCell disabled description='Обновлен в течение недели'>Рейтинг</SimpleCell>}>
			{scoreData === null ? <ScreenSpinner />:
			scoreData && scoreGenerator()}
			<Spacing separator />
			<SimpleCell
				disabled
				before={<Avatar src={props.vkInfoUser.photo_max_orig} />}
				description={props.userInfo.topic_name + ' · ' + 
				props.userInfo.actions_current_week.toLocaleString() + 
				' ' + enumerate(props.userInfo.actions_current_week, ['пост', 'поста', 'постов'])}
				after={<Counter style={{background: '#70B2FF'}}>{props.userInfo.position}</Counter>}>
					<div style={{display: 'flex'}}>
						{`${props.vkInfoUser.first_name} ${props.vkInfoUser.last_name}`} {props.userInfo.is_best && <Icon16Crown className='crown crown_profile' />}
					</div>
			</SimpleCell>

		</Group></>}

		
			{props.isExpert === null ? <ScreenSpinner /> : !props.isExpert &&
			(platform === VKCOM) && <Group><RichCell
			multiline
			disabled
			before={<Avatar size={72} src={experts_community}></Avatar>}
			actions={
				<Button size='m'
				href={GENERAL_LINKS.group_official_community}
				target="_blank" rel="noopener noreferrer"
				>
					Подать заявку в сообщество
				</Button>
			}
			caption={GROUP_DESCRIPTIONS.pc.official}>
				<div style={{display: 'flex'}}>Эксперты ВКонтакте <Icon16Verified className='verified' /></div>
			</RichCell></Group>}
		{props.isExpert === null ? <ScreenSpinner /> : props.isExpert &&
		<Group>
			<MenuArticles 
			activeTopic={props.activeTopic} />
		</Group>}
		<Group>
			<Div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
				<Link>Клуб экспертов ВКонтакте</Link>
				
				{showPlayer ? <IconButton
				onClick={() => playAudio()}>
					<Icon28VideoCircleOutline
						style={{color:'var(--accent)'}}
						className={audio ? audioPaused ? '' : 'heart_anim' : ''} />
				</IconButton>:
				<Icon16Like 
				onClick={() => easterEggCounter()}
				style={heartClicks ? {transform: `scale(${1 + heartClicks/10})`} : {}} 
				className={heartClicks === 0 ? 'heart_bottom heart_anim' : 'heart_bottom'} />}
			</Div>
		</Group>

	</Panel>
	);
}

