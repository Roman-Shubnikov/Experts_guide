import React from 'react';
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
import { useSelector } from 'react-redux';

export const Curators = props => {
    const platform = usePlatform();
    const curatorsData = useSelector(state => state.account.curators_data);
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
                bottom={<Subhead style={{marginTop: 10, color: '#818C99'}} weight="regular">11 тематик · {curatorsData && curatorsData.length + " " + enumerate(curatorsData.length, ['куратор', 'куратора', 'кураторов'])}</Subhead>}>
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
                description={val.topic ? CURATOR_PATTERN + `«${val.topic}»` : null}>
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
                Как стать куратором?
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
