import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { 
	Panel,
	Group, 
	Placeholder,
	IconButton,
	FormLayout,
	FormItem,
	Input,
	PanelSpinner,

} from '@vkontakte/vkui';
import {
	Icon16Clear,
	Icon56BlockOutline,
	Icon56CancelCircleOutline, 
	Icon56MentionOutline,

} from '@vkontakte/icons'
import { UserGradient } from '../components';
let lastTypingTime;
let typing = false;
let searchval = '';
const placeholderTexts = {
	default: 'Начните вводить ссылку пользователя',
	link_error: 'Недопустимый формат или неправильный адрес страницы',
	not_found: 'Данный пользователь не состоит или был исключен из программы экспертов',
	blocked: 'Данный пользователь удалён или заблокирован'
}
export default props => {
	const [searchQuery, setSearchQuery] = useState('');
	const [userSearchedInfo, setInfoUser] = useState(null);
	const [fetching, setFetching] = useState(false);
	const [tokenSearch, setTokenSearch] = useState('');
	const [isExpert, setIsExpert] = useState(false);
	const [placeHolderText,setPlaceholderText] = useState(placeholderTexts.default);
	const fetchUser = () => {
		setFetching(true);
		setInfoUser(null);
		setIsExpert(false);
		let new_user_info = [];
		searchval = prepareQueryString(searchval)
		resolveScreenName(searchval).then(search_user => {
			bridge.send('VKWebAppCallAPIMethod', {
				method: 'users.get',
				params: {
					user_id: search_user,
					fields: 'photo_100,screen_name,last_seen',
					v: "5.131", 
					access_token: tokenSearch,
				}
			})
			.then(data => {
				if(data.response[0].deactivated) {
					setPlaceholderText(placeholderTexts.blocked);
					setInfoUser(null);
					setFetching(false);
					return;
				};
	
				new_user_info.push(data.response[0]);
				fetch(`https://c3po.ru/api/experts.getInfo?user_id=${search_user}&` + window.location.search.replace('?', ''))
				.then(data => data.json())
				.then(data => {
					if(data.items.length !== 0 && data.items[0]['is_expert']){
						let info = data.items[0];
						setIsExpert(true)
						let user = info['info'];
						new_user_info.push(user);
					} else {
						setPlaceholderText(placeholderTexts.not_found)
						new_user_info.push(null);
					}
					setInfoUser(new_user_info);
					setFetching(false)
				})
				.catch(err => console.log(err))
			})
			.catch(e => {
				setFetching(false);
				setPlaceholderText(placeholderTexts.link_error)
			})
		})
		
	}
	const updateTyping = () => {
        if(!typing){
            typing = true;
            
        }
        lastTypingTime = (new Date()).getTime();
        setTimeout(() => {
            const typingTimer = (new Date()).getTime();
            const timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= 600 && typing) {
                typing = false;
                if(searchval.length === 0) {setInfoUser(null); return;}
                if(searchval.length <= 0) return;
                fetchUser()
            }
        }, 600)

    }
	const getIconForPlaceholder = () => {
		if(placeHolderText === placeholderTexts.link_error) return <Icon56CancelCircleOutline />
		if(placeHolderText === placeholderTexts.default) return <Icon56MentionOutline />
		if(placeHolderText === placeholderTexts.blocked) return <Icon56BlockOutline />
	}
	const resolveScreenName = async (q) => {
		if(!isNaN(q)) return q; 
		let data = await bridge.send("VKWebAppCallAPIMethod", {
			method: 'utils.resolveScreenName',
			params: {
				screen_name: q,
				v: "5.131", 
				access_token: tokenSearch,
			}
		})
		let user;
		if(data.response.type !== 'user') return '';
		user = data.response.object_id;
		return user;
	}
	const prepareQueryString = (q) => {
		let user_string = q;
		if(isNaN(user_string)){
			if(/vk\.com\/.+/.test(user_string)){
				user_string = user_string.match(/(?<=vk\.com\/)[a-z0-9]+/ui)[0];
			}
		}
		return user_string;
	}
	useEffect(() => {
		bridge.send("VKWebAppGetAuthToken", {"app_id": 7934508, "scope": ""})
			.then(data => {
				setTokenSearch(data.access_token);
			})
	}, [])
    return(
        <Panel id={props.id}>
            <Group>
				<FormLayout>
					<FormItem>
						<Input
						placeholder='Введите ссылку на пользователя'
						after={searchQuery!== '' && <IconButton 
							hoverMode="opacity" 
							aria-label="Очистить поле"
							onClick={() => {setSearchQuery('');searchval='';setInfoUser(null);setPlaceholderText(placeholderTexts.default)}}>
								<Icon16Clear/>
							</IconButton>}
						value={searchQuery}
						onChange={e => {
							searchval = e.currentTarget.value
                            setSearchQuery(e.currentTarget.value)
							updateTyping()
							}} />
					</FormItem>
				</FormLayout>
			</Group>
			{userSearchedInfo &&
			<UserGradient 
			placeHolderText={placeHolderText}
			userSearchedInfo={userSearchedInfo}
			isExpert={isExpert} />
			}
			{(fetching || !userSearchedInfo) && <Group>
				{fetching ? <PanelSpinner /> : 
				!userSearchedInfo && <Placeholder
				icon={getIconForPlaceholder()}>
					{placeHolderText}
				</Placeholder>}
			</Group>}
			
        </Panel>
    )
}