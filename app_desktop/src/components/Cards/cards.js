import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
    Link,
    SimpleCell,

} from '@vkontakte/vkui';
import './style.css';
import { Apps28, Brains28 } from '../../img/icons';
import { chatLinks } from '../../config';
import { useSelector } from 'react-redux';
export const Cards = props => {
    const { activeTopic } = useSelector((state) => state.account)
    return(
        <div style={{width: '50%', display: 'flex', justifyContent: 'end'}}>
            <SimpleCell
            onClick={() => bridge.send(
                'VKWebAppOpenApp',
                {
                    app_id: 7171491,
                    location: ''
                }
            )}
            after={<div style={{width: 40}}><Brains28 className='card_icon' size={56} /></div>}
            className='card'
            description={<Link>Открыть</Link>}>
                Карточка эксперта
            </SimpleCell>
            <SimpleCell
            target="_blank" rel="noopener noreferrer"
            href={chatLinks[activeTopic]}
            after={<div style={{width: 40}}><Apps28 className='card_icon' size={56} /></div>}
            className='card'
            description={<Link>Перейти</Link>}>
                Чат
            </SimpleCell>
        </div>
    )
}