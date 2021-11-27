import React, { useState, useEffect, useRef, useCallback } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { SkeletonTheme } from "react-loading-skeleton";
import {
	View, 
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
	PanelSpinner,
	Epic,
	Tabbar,
	TabbarItem,
	Select,
	FormItem,
	SimpleCell,

} from '@vkontakte/vkui';
import {
	Icon28HomeOutline,
	Icon28UserCardOutline,
	Icon28ListOutline,
	Icon28ReportOutline,
	Icon28UserCircleOutline,
	Icon28HelpCircleOutline,
	Icon16Verified,
} from '@vkontakte/icons'
import {
	ProfileInfo,
} from './components'
import '@vkontakte/vkui/dist/vkui.css';
import './styles/styles.css';
import { calculateAdaptivity } from './functions/calcAdaptivity';
import { 
	CreatePosts,
	Reports,
	Profile,
	UsersInfoGet,
	Loader,
	Home,
	Curators,
	Topics,
	Help,
	HelpCategories,
	HelpCreateCategory,
	HelpCreateQuestion,
	HelpQuestion,
	Disconnect,

} from './panels'
import { ACTIONS_NORM, API_URL, GENERAL_LINKS, ICON_TOPICS, TOPICS } from './config';
import { errorAlertCreator, getKeyByValue } from './functions/tools';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions, storActions, viewsActions } from './store/main';
import { EpicPC, PostGroup } from './Units';
import { isEmptyObject } from 'jquery';
const scheme_params = {

	bright_light: { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" },
	space_gray: { "status_bar_style": "light", "action_bar_color": "#19191A", 'navigation_bar_color': "#19191A" }
  }
var backTimeout = false;
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const App = () => {
	const dispatch = useDispatch();
	const { activeTab: faqActiveTab } = useSelector((state) => state.Faq)
	const { 
		user: userInfo, 
		schemeSettings: {scheme}, 
		activeTopic, 
		tokenSearch
	} = useSelector((state) => state.account)
	const { activeStory, historyPanels, snackbar, activePanel, need_epic } = useSelector((state) => state.views)
	const setHistoryPanels = useCallback((history) => dispatch(viewsActions.setHistory(history)), [dispatch]);
	const setCuratorsData = useCallback((data) => dispatch(accountActions.setCurators(data)), [dispatch]);
  	const setActiveScene = useCallback((story, panel) => dispatch(viewsActions.setActiveScene(story, panel)), [dispatch]);
	const setActiveTopic = useCallback((data) => dispatch(accountActions.setActiveTopic(data)), [dispatch]);
	const setTokenSearch = useCallback((data) => dispatch(accountActions.setTokenSearch(data)), [dispatch]);
	const setScoreData = useCallback((data) => dispatch(storActions.setScoreData(data)), [dispatch]);
	const [vkInfoUser, setVkInfoUser] = useState(null);
	const [achievements, setAchievements] = useState(null);
	const [isExpert, setIsExpert] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [actsWeek, setActsWeek] = useState(0);
	
	const platformvkui = usePlatform();
	const platform = useRef();
	const viewWidthVk = useAdaptivity().viewWidth;
	const isDesktop = useRef();
	const hasHeader = useRef()

	const setHash = (hash) => {
	  if(window.location.hash !== ''){
		bridge.send("VKWebAppSetLocation", {"location": hash});
		window.location.hash = hash
	  }
	}
	const goPanel = useCallback((view, panel, forcePanel=false, replaceState=false) => {
    
		const checkVisitedView = (view) => {
		  let history = [...historyPanels];
		  history.reverse();
		  let index = history.findIndex(item => item.view === view)
		  if(index !== -1) {
		   return history.length - index
		  } else {
			return null;
		  }
		}
		const historyChange = (history, view, panel, replaceState) => {
		  if(replaceState){
			history.pop();
			history.push({view, panel });
			window.history.replaceState({ view, panel }, panel);
		  } else {
			history.push({view, panel });
			window.history.pushState({ view, panel }, panel);
		  }
		  return history;
		}
		let history = [...historyPanels];
		if(forcePanel){
		  history = historyChange(history, view, panel, replaceState)
		}else{
		  let index = checkVisitedView(view);
		  if(index !== null){
			let new_history = history.slice(0, index);
			history = new_history
			window.history.pushState({ view, panel }, panel);
			({view, panel} = history[history.length - 1])
		  } else {
			history = historyChange(history, view, panel, replaceState)
		  }
		}
		setHistoryPanels(history);
		setActiveScene(view, panel)
		bridge.send('VKWebAppEnableSwipeBack');
	  }, [setActiveScene, historyPanels, setHistoryPanels])
	const goDisconnect = () => {
		goPanel('disconnect', 'disconnect');
	}
	const showErrorAlert = (error = null, action = null) => {
		errorAlertCreator(setPopout, error, action)
	}
	const Init = useCallback(() => {
		const brigeSchemeChange = (params) => {
			// bridge.send("VKWebAppSetViewSettings", params);
		  }
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				let new_scheme = data.scheme ? data.scheme : 'client_light';
				dispatch(accountActions.setScheme({ scheme: new_scheme}))
				if(platformname){
					switch (new_scheme) {
						case 'bright_light':
						  brigeSchemeChange(scheme_params.bright_light)
						  break;
						case 'space_gray':
						  brigeSchemeChange(scheme_params.space_gray)
						  break;
						default:
						  brigeSchemeChange(scheme_params.bright_light)
					}
				}
				
			}
		});
		
		bridge.send("VKWebAppInit");
		async function fetchData(token) {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setVkInfoUser(user);
			fetch(API_URL + 'method=account.get&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				if(!data.result) throw Error('no data')
				let info = data.response.expert_info;
				setIsExpert(info.is_expert)
				let useri = info.info;
				setAchievements(data.response.achievements)
				if(useri.actions_current_week >= ACTIONS_NORM) {
					setActsWeek(700);
				}else{
					setTimeout(() => {
						setActsWeek(useri.actions_current_week)
					},500)
				}
				if(info.is_expert) setActiveTopic(getKeyByValue(TOPICS, useri.topic_name));
				let finalUser = data.response;
				finalUser.expert_info = useri
				finalUser.vk_info = user;
				dispatch(accountActions.setUser(finalUser))
				if(info.is_expert) {
					goPanel('home', 'home', true, true)
					
					fetch(API_URL + `method=service.getActivists&` + window.location.search.replace('?', ''))
					.then(data => data.json())
					.then(curators_data => {
						bridge.send('VKWebAppCallAPIMethod', {
							method: 'users.get',
							params: {
								user_ids: curators_data.response.slice().toString(),
								fields: 'photo_100,screen_name,online',
								v: "5.131", 
								access_token: token,
							}
						})
						.then((data) => {
							let vk_curators_info = [...data.response]
							fetch(API_URL + `method=experts.getInfo&` + window.location.search.replace('?', ''),
							{
								method: 'post',
								headers: { "Content-type": "application/json; charset=UTF-8" },
								body: JSON.stringify({
									user_ids: curators_data.response.slice().toString()
								})
							})
							.then(data => data.json())
							.then(data => {
								let modify_data = [...data.response]
								modify_data = modify_data.map(i => i.info)
								vk_curators_info = vk_curators_info.map((item) => {
									let new_item = {...item};
									new_item.topic = modify_data.find((i) => i.user_id === item.id).topic_name
									return new_item
								})
								setCuratorsData(vk_curators_info)
							})
							.catch(e => console.log(e))
						})
					})
					.catch(e => console.log(e))

					fetch(API_URL + 'method=experts.getTop&' + window.location.search.replace('?', ''))
						.then(data => data.json())
						.then(data => {
							data = data.response
							let sliced_data = {}
							for(let i =0; i<data.keys.length;i++) {
								sliced_data[getKeyByValue(TOPICS, data.keys[i])] = data[data.keys[i]];
							}
							sliced_data['users_data'] = data.users_data;
							setScoreData(sliced_data)
						})
						.catch(err => console.log(err))
						
				}else {
					dispatch(viewsActions.setNeedEpic(false))
					goPanel('topics', 'topics', true, true)
				}
				
				setPopout(null);
				
				bridge.send("VKWebAppSendPayload", {"group_id": 206651170, "payload": {'action': 'openapp', "is_expert": info['is_expert'], 'poshil_naher': 'kozel'}});
			})
			.catch(err => {setPopout(null);goDisconnect()})
			
		}
		bridge.send("VKWebAppGetAuthToken", {"app_id": 7934508, "scope": ""})
			.then(token => {
				setTokenSearch(token.access_token);
				fetchData(token.access_token);
			})
		
			// eslint-disable-next-line
	}, [])
	useEffect(() => {
		Init()

	}, [Init]);
	const goBack = useCallback(() => {
		let history = [...historyPanels]
		if(!backTimeout) {
		  backTimeout = true;
		  if (history.length <= 1) {
			  bridge.send("VKWebAppClose", {"status": "success"});
		  } else {
			if(history[history.length] >= 2) {
			  bridge.send('VKWebAppDisableSwipeBack');
			}
			setHash('');
			history.pop()
			let {view, panel} = history[history.length - 1];
			setActiveScene(view, panel)
			setPopout(<ScreenSpinner />)
			setTimeout(() => {
				setPopout(null)
			  }, 500)
		  }
		  setHistoryPanels(history)
		  setTimeout(() => {backTimeout = false;}, 500)
		  
		}else{
		  window.history.pushState({ ...history[history.length - 1] }, history[history.length - 1].panel );
		}
	  }, [historyPanels, setHistoryPanels, setActiveScene])
	const handlePopstate = useCallback((e) => {
		e.preventDefault();
		goBack();
	  }, [goBack]);
	useEffect(() => {
	  if (platformname) {
		platform.current = platformvkui;
	  } else {
		platform.current = Platform.VKCOM;
	  }
	}, [platformvkui])

	useEffect(() => {
		window.addEventListener('popstate', handlePopstate);
		return () => {
		  window.removeEventListener('popstate', handlePopstate)
		}
	  }, [handlePopstate])
	
	useEffect(() => {
	  hasHeader.current = platform.current !== VKCOM;
	  isDesktop.current = viewWidthVk >= ViewWidth.SMALL_TABLET;
	}, [viewWidthVk, platform])

	
	const getActualTopic = () => {
		let my_topic_index = ICON_TOPICS.findIndex((val, i) => val.topic === userInfo.expert_info.topic_name)
		let iconTopics_actual = ICON_TOPICS.slice();
		if(isExpert && my_topic_index !== -1){
			let my_topic = iconTopics_actual.splice(my_topic_index, 1);
			iconTopics_actual.unshift(my_topic[0])
		}
		return iconTopics_actual;
	}

	const genRightMenu = () => {
		let menu_render = [];
		let iconTopics_actual = getActualTopic();
		iconTopics_actual.forEach((val) => menu_render.push({ label: val.topic, value: getKeyByValue(TOPICS, val.topic) }))
		return(
			<FormItem>
				<Select
				value={activeTopic}
				onChange={e => setActiveTopic(e.currentTarget.value)}
				placeholder="Не выбран"
				options={menu_render} />
			</FormItem>
			
		)
	}
	const onEpicTap = (e) => {
		setActiveScene(e.currentTarget.dataset.story, e.currentTarget.dataset.story);
	}
	const callbacks = {showErrorAlert, goPanel}
	const navigation = {goDisconnect, setPopout}
	const Views = [
		<View id='home' activePanel={activePanel} key='home'>
			<Home
			id='home'
			navigation={navigation}
			goPanel={goPanel}
			/>
			<CreatePosts
			id='createposts'
			navigation={navigation}
			callbacks={callbacks} />
		</View>,
		<View id='topics' activePanel={activePanel} key='topics'>
			<Topics id='topics'
			activeTopic={activeTopic}
			vkInfoUser={vkInfoUser} 
			isExpert={isExpert}
			userInfo={userInfo.expert_info}
			actsWeek={actsWeek}
			getActualTopic={getActualTopic}
			setActiveTopic={setActiveTopic} />
		</View>,
		<View id='curators' activePanel={activePanel} key='curators'>
			<Curators
			id='curators'
			tokenSearch={tokenSearch} />
		</View>,
		<View id='searchInfo' activePanel={activePanel} key='searchInfo'>
			<UsersInfoGet
			id='searchInfo'
			tokenSearch={tokenSearch} />
		</View>,
		<View id='profile' activePanel={activePanel} key='profile'>
			<Profile 
			id='profile'
			userInfo={userInfo.expert_info}
			vkInfoUser={vkInfoUser}
			goPanel={goPanel}
			achievements={achievements} />
		</View>,
		<View id='reports' activePanel={activePanel} key='reports'>
			<Reports
			userInfo={userInfo.expert_info}
			tokenSearch={tokenSearch}
			showErrorAlert={showErrorAlert}
			id='reports' />
		</View>,
		<View id='help' activePanel={activePanel} key='help'>
			<Help
			navigation={navigation}
			callbacks={callbacks}
			id='help' />
			<HelpCreateCategory
			id='faqCreateCategory'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpCreateQuestion
			id='faqCreateQuestion'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpQuestion
			id='faqQuestion'
			navigation={navigation}
			callbacks={callbacks} />

		</View>,
		<Disconnect id='disconnect' restart={Init} key='disconnect' />,
		<View id='loader' activePanel={activePanel} key='loader'>
			<Loader 
			id='load' />
		</View>,
	];
	
	return (
		
		<ConfigProvider scheme={scheme} platform={platform.current}>
			
			<AppRoot>
				<div style={{width: '100%'}}>
				<Group>
					{(isExpert === null || isEmptyObject(userInfo)) ? <PanelSpinner height={65} /> : isExpert && <ProfileInfo
						activePanel={activePanel}
						actsWeek={actsWeek}
						vkInfoUser={vkInfoUser}
						userInfo={userInfo.expert_info}
						goPanel={goPanel} />}
				</Group>
				<SplitLayout
					style={{ justifyContent: "center" }}
					popout={popout}>
					
					<SplitCol
					animate={!isDesktop.current}
					spaced={isDesktop.current}
					width={isDesktop.current ? '704px' : '100%'}
					maxWidth={isDesktop.current ? '704px' : '100%'}>
						<SkeletonTheme color={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#232323'} 
						highlightColor={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#6B6B6B'}>
						<Epic activeStory={activeStory}
						tabbar={!isDesktop.current && need_epic && 
							<Tabbar>
								<TabbarItem
								data-story='home'
								selected={activeStory === 'home'}
								onClick={onEpicTap}
								text='Главная'>
									<Icon28HomeOutline />
								</TabbarItem>
								<TabbarItem
								data-story='searchInfo'
								selected={activeStory === 'searchInfo'}
								onClick={onEpicTap}
								text='Участники'>
									<Icon28UserCardOutline />
								</TabbarItem>
								<TabbarItem
								data-story='topics'
								selected={activeStory === 'topics'}
								onClick={onEpicTap}
								text='Тематики'>
									<Icon28ListOutline />
								</TabbarItem>
								<TabbarItem
								data-story='reports'
								selected={activeStory === 'reports'}
								onClick={onEpicTap}
								text='Репорты'>
									<Icon28ReportOutline />
								</TabbarItem>
								<TabbarItem
								data-story='help'
								selected={activeStory === 'help'}
								onClick={onEpicTap}
								text='Помощь'>
									<Icon28HelpCircleOutline />
								</TabbarItem>
								<TabbarItem
								data-story='profile'
								selected={activeStory === 'profile'}
								onClick={onEpicTap}
								text='Профиль'>
									<Icon28UserCircleOutline />
								</TabbarItem>
							</Tabbar>
						}>
							
							{Views}
							
						</Epic>
						</SkeletonTheme>
					</SplitCol>
					{isDesktop.current && userInfo.expert_info &&
					<SplitCol fixed width="280px" maxWidth="280px">
						<Panel id='menu_epic'>
							{hasHeader.current && <PanelHeader/>}
							{isExpert === null ? <PanelSpinner /> : isExpert &&
							<>
							<EpicPC go={goPanel} />
							</>}
							{/* {activeStory === "home" &&
							<ScoreRight />} */}
							{activeStory === "home" && 
							<Group>
								<SimpleCell
								href={GENERAL_LINKS.group_official}
								target="_blank" rel="noopener noreferrer">
									<div style={{display: 'flex'}}>Эксперты ВКонтакте <Icon16Verified className='verified' /></div>
								</SimpleCell>
							</Group>}
							{activeStory === "help" && activePanel === 'help' && faqActiveTab === "list" && 
							<HelpCategories
							navigation={navigation}
							callbacks={callbacks}
							id='help' />
							}
							{activeStory === "home" && <Group>
								{genRightMenu()}
							</Group>}
							{activeStory === "home" && 
							<PostGroup
							callbacks={callbacks} 
							/>}
						</Panel>
					</SplitCol>}
					{snackbar}
				</SplitLayout>
				</div>
			</AppRoot>
		
		</ConfigProvider>
		
	);
}
export default () => (
	<AdaptivityProvider viewWidth={ calculateAdaptivity( document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
    	<App />
  	</AdaptivityProvider>
);
