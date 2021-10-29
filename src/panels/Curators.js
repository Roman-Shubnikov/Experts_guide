import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	VKCOM,
	usePlatform,
	Panel,
	PanelHeader,
	Group,
	SimpleCell,
	Div,
	Link,
	PanelSpinner,
    RichCell,
    Avatar,
    Subhead,
    Header,
} from '@vkontakte/vkui';
import {
    Icon16ChevronOutline,
} from '@vkontakte/icons';
import { enumerate } from '../functions/tools';
import Curators_ava from '../img/Curators_ava.svg';
import { GENERAL_LINKS, CURATOR_PATTERN } from '../config';
const curators = [
    381938819,
    70713961, 
    355807901,
    465887853, 
    526444378,
    248525108,
    343013216,
    473574422,
    534899473,
    60174020,
    385045960,
]
const Curators = props => {
    const { tokenSearch } = props;
    const platform = usePlatform();
    const [curatorsData, setCuratorsData] = useState(null);
    useEffect(() => {
        bridge.send('VKWebAppCallAPIMethod', {
            method: 'users.get',
            params: {
                user_ids: curators.slice().toString(),
                fields: 'photo_100,screen_name,online',
                v: "5.131", 
                access_token: tokenSearch,
            }
        })
        .then((data) => {
            let vk_curators_info = [...data.response]
            fetch(`https://c3po.ru/api/experts.getInfo?user_id=${curators.slice().toString()}&` + window.location.search.replace('?', ''))
            .then(data => data.json())
            .then(data => {
                let modify_data = {...data}
                modify_data = modify_data.items.map(i => i.info)
                vk_curators_info = vk_curators_info.map((item) => {
                    let new_item = {...item};
                    new_item.topic = modify_data.find((i) => i.user_id === item.id).topic_name
                    return new_item
                })
                setCuratorsData(vk_curators_info)
            })
            .catch(e => console.log(e))
        })
    }, [tokenSearch])
    return(
        <Panel id={props.id}>
            {platform !== VKCOM && 
            <PanelHeader>Кураторы</PanelHeader>}
            <Group>
                <RichCell
                multiline
                disabled
                before={<Avatar src={Curators_ava} size={72} mode='app' />}
                caption='Мы собрали всех кураторов, которые
                рассказывают новое о контент-индустрии и тематических
                лентах ВКонтакте'
                bottom={<Subhead style={{marginTop: 10, color: '#818C99'}} weight="regular">11 тематик · {curators.length} {enumerate(curators.length, ['куратор', 'куратора', 'кураторов'])}</Subhead>}>
                    Кураторы тематических лент
                </RichCell>
            </Group>
            <Group header={<Header>Кураторы</Header>}>
                {curatorsData === null && <PanelSpinner/>}
                {curatorsData && 
                curatorsData.map((val,i) => 
                <SimpleCell
                expandable
                before={<Avatar shadow={false} className='avatar' size={48} src={val.photo_100}>
                    {val.online === 1 && <div className='avatar_online'></div>}
                </Avatar>}
                key={i}
                href={'https://vk.com/' + val.screen_name}
                target="_blank" rel="noopener noreferrer"
                description={CURATOR_PATTERN + `«${val.topic}»`}>
                    {val.first_name + " " + val.last_name}
                </SimpleCell>
                )}
            </Group>
            {platform === VKCOM ?
            <Group header={<Header 
                aside={<Link 
                    href={GENERAL_LINKS.curators}
                    target="_blank" rel="noopener noreferrer"
                    style={{color: '#818C99', fontSize: 16}}>
                        Подробнее {<Icon16ChevronOutline style={{marginTop: 1, marginLeft: 2, color: '#818C99'}} />}
                    </Link>}
                >
                Как им стать?
            </Header>}>
                <Div style={{paddingTop: 0}}>
                    <Subhead size={13} style={{color: '#818C99'}} weight='medium'>Стать самостоятельно им нельзя. Отныне отбором занимается наша команда. 
                    Если вы зарекомендуете себя в оценивании постов своей тематической ленты, то, возможно, вас пригласят к нам.</Subhead>
                </Div>
                
            </Group> 
            : 
            <Group>
                <SimpleCell
                href={GENERAL_LINKS.curators}
                target="_blank" rel="noopener noreferrer"
                multiline
                after={<Icon16ChevronOutline />}
                description='Стать самостоятельно им нельзя. Отныне отбором занимается наша команда. 
                Если вы зарекомендуете себя в 
                оценивании постов своей тематической ленты, то, возможно, вас пригласят к нам.'
                expandable>
                    Как им стать?
                </SimpleCell>

            </Group>}
        </Panel>
    )
}

export default Curators;