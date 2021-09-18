import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { 
    Panel,
    Group,
    Placeholder,
    usePlatform,
    VKCOM,
    PanelHeader,
    Header,
    Avatar,
    PanelSpinner,
    Div,
    Tooltip,
    Tappable,
    Link,
    Subhead,
    SimpleCell,

} from "@vkontakte/vkui"
import {
    Icon16ChevronOutline
} from '@vkontakte/icons';
import { ButtonBack } from '../components';
import { GENERAL_LINKS } from '../config';
const Achievements = props => {
    const { achievements } = props; 
    const platform = usePlatform();
    const [tooltipShow, setToolTipState] = useState(false);
    return(
        <Panel id={props.id}>
            {platform !== VKCOM && 
            <PanelHeader>Кураторы</PanelHeader>}
            <ButtonBack setActivePanel={props.setActivePanel} />
            <Group header={<Header indicator={achievements?.length >0 ? achievements?.length: null}>Достижения</Header>}>
            {achievements === null ? <PanelSpinner/> :
            achievements?.length >0 ? 
                <Div className={'achievements' + (platform === VKCOM ? ' achievements-vkcom':'')} style={{paddingTop: 0}}>
                    {achievements?.map((val, i) => 
                    <Tooltip
                    mode="light"
                    key={val.id}
                    text={val.description}
                    isShown={tooltipShow === i}
                    onClose={() => setToolTipState(false)}
                    offsetX={10}>
                        <Tappable
                        className='achievements_item'
                        onClick={() => setToolTipState(i)}>
                            <Avatar
                            style={{margin: '0 auto'}} 
                            shadow={false} 
                            size={platform === VKCOM ? 89 : 90} 
                            src={val.photo} 
                            alt={val.placeholder} />
                        </Tappable>
                        
                    </Tooltip> 
                    )}
                    
                </Div>
                : 
                    <Placeholder>Пока у вас нет достижений ¯\_(ツ)_/¯</Placeholder>}
                
            </Group>
            {platform === VKCOM ?
            <Group header={<Header 
                aside={<Link 
                    href={GENERAL_LINKS.achievements}
                    target="_blank" rel="noopener noreferrer"
                    style={{color: '#818C99', fontSize: 16}}>
                        Предложить {<Icon16ChevronOutline style={{marginTop: 1, marginLeft: 2, color: '#818C99'}} />}
                    </Link>}
                >
                Есть идея для достижения?
            </Header>}>
                <Div style={{paddingTop: 0}}>
                    <Subhead size={13} style={{color: '#818C99'}} weight='medium'>
                        Присылаем сюда идеи для новых достижений. Не забудьте подробно описать при каких действиях выдается ачивка. Также не забудьте про описание.
                    </Subhead>
                </Div>
                
            </Group> 
            : 
            <Group>
                <SimpleCell
                href={GENERAL_LINKS.achievements}
                target="_blank" rel="noopener noreferrer"
                multiline
                after={<Icon16ChevronOutline />}
                description='Присылаем сюда идеи для новых достижений. Не забудьте подробно описать при каких действиях выдается ачивка. Также не забудьте про описание.'
                expandable>
                    Есть идея для достижения?
                </SimpleCell>

            </Group>}
        </Panel>
    )
}
Achievements.propTypes = {
    setActivePanel: PropTypes.func.isRequired,
    achievements: PropTypes.array,
}
export default Achievements;