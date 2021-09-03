import React, { useState, useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, 
	ScreenSpinner, 
	AdaptivityProvider, 
	AppRoot, 
	ConfigProvider,
	ViewWidth,
	VKCOM,
	usePlatform,
	Platform,
	useAdaptivity,
	Panel,
	PanelHeader,
	SplitLayout,
	SplitCol,
	Group,
	Button,
	SimpleCell,
	Text,
	Div,
	Link,
	Spacing,
	PanelSpinner,
} from '@vkontakte/vkui';
import {
	Icon28BrainOutline,
	Icon28SubtitlesOutline,
} from '@vkontakte/icons'
import {
	EpicMenuCell,
	ProfileInfo,
} from './components'
import '@vkontakte/vkui/dist/vkui.css';
import './styles/styles.css';
import { calculateAdaptivity } from './functions/calcAdaptivity';
import Home from './panels/Home';
import Loader from './panels/Loader';
import UsersInfoGet from './panels/UsersInfoGet';
import { ACTIONS_NORM, GENERAL_LINKS, ICON_TOPICS, TOPICS } from './config';
import { getKeyByValue } from './functions/tools';
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const App = () => {
	const [activePanel, setActivePanel] = useState('loader');
	const [vkInfoUser, setVkInfoUser] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	const [isExpert, setIsExpert] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [scheme, setScheme] = useState('bright_light');
	const [actsWeek, setActsWeek] = useState(0);
	const [activeTopic, setActiveTopic] = useState('art')
	const platformvkui = usePlatform();
	const platform = useRef();
	const viewWidthVk = useAdaptivity().viewWidth;
	const isDesktop = useRef();
	const hasHeader = useRef()
	
	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme ? data.scheme : 'client_light')
			}
		});
		bridge.send("VKWebAppInit");
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setVkInfoUser(user);
			// fetch(`https://c3po.ru/api/experts.getInfo?user_id=526444378&` + window.location.search.replace('?', ''))
			fetch(`https://c3po.ru/api/experts.getInfo?user_id=${user.id}&` + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				let info = data.items[0];
				setIsExpert(info['is_expert'])
				let user = info['info'];
				if(user.actions_current_week >= ACTIONS_NORM) {
					setActsWeek(700);
				}else{
					setTimeout(() => {
						setActsWeek(user.actions_current_week)
					},500)
				}
				if(info['is_expert']) setActiveTopic(getKeyByValue(TOPICS, user.topic_name));
				setUserInfo(user)
				setActivePanel('home')
				
				setPopout(null);
				
				bridge.send("VKWebAppSendPayload", {"group_id": 206651170, "payload": {'action': 'openapp', "is_expert": info['is_expert'], 'poshil_naher': 'kozel'}});
			})
			.catch(err => console.log(err))
			
		}
		fetchData();
	}, []);
	
	
	useEffect(() => {
	  if (platformname) {
		platform.current = platformvkui;
	  } else {
		platform.current = Platform.VKCOM;
	  }
	}, [platformvkui])
  
	
	useEffect(() => {
	  hasHeader.current = platform.current !== VKCOM;
	  isDesktop.current = viewWidthVk >= ViewWidth.SMALL_TABLET;
	}, [viewWidthVk, platform])

	
	const getActualTopic = () => {
		let my_topic_index = ICON_TOPICS.findIndex((val, i) => val.topic === userInfo.topic_name)
		let iconTopics_actual = ICON_TOPICS.slice();
		if(isExpert){
			let my_topic = iconTopics_actual.splice(my_topic_index, my_topic_index+1);
			iconTopics_actual.unshift(my_topic[0])
		}
		return iconTopics_actual;
	}
	const genRightMenu = () => {
		let menu_render = [];
		let iconTopics_actual = getActualTopic();
		iconTopics_actual.forEach((val, i) => {
			let Icon = val.icon
			menu_render.push(
				<EpicMenuCell
				activePanel={activePanel}
				key={val.topic}
				disabled={!isExpert}
				activeTopic={activeTopic}
				topic={getKeyByValue(TOPICS, val.topic)}
				icon={<Icon style={{color: val.color}} />}
				setActivePanel={setActivePanel}
				setActiveTopic={setActiveTopic}>
					{val.topic}
				</EpicMenuCell>
			)
		})
		return menu_render
	}
	
	return (
		<ConfigProvider scheme={scheme} platform={platform.current}>
			<AppRoot>
				<SplitLayout
					style={{ justifyContent: "center" }}
					popout={popout}>
					
					<SplitCol
					animate={!isDesktop.current}
					spaced={isDesktop.current}
					width={isDesktop.current ? '704px' : '100%'}
					maxWidth={isDesktop.current ? '704px' : '100%'}>
						<View activePanel={activePanel}>
							<Home id='home' 
							activeTopic={activeTopic}
							vkInfoUser={vkInfoUser} 
							isExpert={isExpert}
							userInfo={userInfo}
							actsWeek={actsWeek}
							getActualTopic={getActualTopic}
							setActiveTopic={setActiveTopic} />
							<UsersInfoGet
							id='searchInfo' />

							<Loader 
							id='loader' />
						</View>
					</SplitCol>
					{isDesktop.current && userInfo &&
					<SplitCol fixed width="280px" maxWidth="280px">
						<Panel id='menu_epic'>
							{hasHeader.current && <PanelHeader/>}
							{isExpert === null ? <PanelSpinner /> : isExpert &&
							<><Group>
								<ProfileInfo
								actsWeek={actsWeek}
								vkInfoUser={vkInfoUser}
								userInfo={userInfo} />								
							</Group>
							<Group>
								<SimpleCell
								style={{color: '#626D7A'}}
								href={GENERAL_LINKS.experts_card}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28BrainOutline style={{color: '#99A2AD'}} />}>
									Карточка эксперта
								</SimpleCell>
								<Spacing separator />
								<SimpleCell
								disabled={activePanel === 'searchInfo'}
								style={activePanel === 'searchInfo' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8,
									color: '#626D7A'} : {color: '#626D7A'}}
								onClick={() => setActivePanel('searchInfo')}
								before={<Icon28SubtitlesOutline style={{color: '#99A2AD'}} />}>
									Информация эксперта
								</SimpleCell>
							</Group></>}
							<Group>
								{genRightMenu()}
							</Group>
							{isExpert ? <Group>
								<Div>
									<Text style={{color: 'var(--subtext)'}}>
										Какие тематики вы хотели бы видеть в ленте <Link
											href='https://vk.com/faq18060'
											target="_blank" rel="noopener noreferrer"
											>
											Рекомендаций
											</Link>?
									</Text>
								</Div>
								<Div>
									<Button mode='secondary'
									size='l'
									stretched
									target="_blank" rel="noopener noreferrer"
									href={GENERAL_LINKS.ideas}>
										Предложить тематику
									</Button>
								</Div>
								
							</Group>: 
							<Group>
								<Div>
									<Text style={{color: 'var(--subtext)'}}>
										Тематические ленты: лучшее про Ваши увлечения
									</Text>
								</Div>
								<Div>
									<Button mode='secondary'
									size='l'
									stretched
									target="_blank" rel="noopener noreferrer"
									href={GENERAL_LINKS.more_about_experts}>
										Узнать подробнее
									</Button>
								</Div>
							</Group>}
						</Panel>
					</SplitCol>}
				</SplitLayout>
			</AppRoot>
		</ConfigProvider>
	);
}
export default () => (
	<AdaptivityProvider viewWidth={ calculateAdaptivity( document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
    	<App />
  	</AdaptivityProvider>
);
