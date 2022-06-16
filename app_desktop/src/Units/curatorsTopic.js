import React, { useEffect, useState } from 'react';
import {
	Group,
	Header,
    HorizontalScroll,
    HorizontalCell,
    PanelSpinner,
    Avatar,
    Placeholder,

} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { TOPICS } from '../config';

export const CuratorsTopic = props => {
    const { curators_data:curatorsData, activeTopic } = useSelector(state => state.account);
    const [curatorsTopic, setCuratorTopic] = useState(null);
    useEffect(() => {
        let curators=null;
        if(curatorsData) curators = curatorsData.filter((i) => (i.topic === TOPICS[activeTopic]))
        setCuratorTopic(curators);
    }, [curatorsData, activeTopic])
    return(
        <Group header={<Header indicator={(curatorsTopic && curatorsTopic.length !==0 )? curatorsTopic.length: ''}>Активисты</Header>}>
            {curatorsTopic === null ? <PanelSpinner height={102} /> : 
            curatorsTopic.length === 0 ?
            <Placeholder style={{height:102}}>В данный момент, активистов нет</Placeholder> :
            <HorizontalScroll showArrows getScrollToLeft={i => i - 120} getScrollToRight={i => i + 120}>
                <div style={{ display: 'flex' }}>

                    {curatorsTopic.map(item => {
                        return(
                            <HorizontalCell key={item.id} 
                            style={{whiteSpace: 'pre-wrap'}}
                            header={item.first_name + '\n' + item.last_name}
                            target="_blank" rel="noopener noreferrer"
                            href={'https://vk.com/' + item.screen_name}
                            >
                                <Avatar size={56} src={item.photo_100} />
                            </HorizontalCell>
                        )
                    }) 
                    }
                </div>
            </HorizontalScroll>
            }
        </Group>
    )
} 