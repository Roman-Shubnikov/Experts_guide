import React, {useEffect, useState} from 'react';
import { 
    Icon56AdvertisingOutline,
    Icon28AddOutline,
    Icon28EditOutline,

} from '@vkontakte/icons';
import {
    Cell,
    Group,
    Panel,
    PanelSpinner,
    Placeholder,
    CellButton,
    PanelHeader,
    PanelHeaderBack,

} from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, ExpertsIcons28, PERMISSIONS } from '../../config';
import { faqActions } from '../../store/main';


export const HelpCategories = props => {
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const { categories } = useSelector((state) => state.Faq)
    const setCategories = (categories) => dispatch(faqActions.setCategories(categories))
    const { showErrorAlert, goPanel } = props.callbacks;
    const { user } = useSelector((state) => state.account)
    const { goDisconnect } = props.navigation;
    const { activeStory } = useSelector((state) => state.views)
    const permissions = user.permissions;
    const admin_permission = permissions >= PERMISSIONS.admin;


    const getCategories = () => {
        fetch(API_URL + "method=faq.getCategories&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setCategories(data.response)
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(goDisconnect)
    }
    
    const delCategory = (id) => {
        fetch(API_URL + "method=faq.delCategory&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'category_id': id
            })
          })
        .then(res => res.json())
        .then(data => {
        if (data.result) {
            getCategories()
        } else {
            showErrorAlert(data.error.message)
        }
        })
        .catch(goDisconnect)
    }
    const goCategory = (id) => {
        goPanel('help', 'helpQuestions', true);
        dispatch(faqActions.setActiveCategory(id))
    }
    const Categories = () => {
        if(!categories) return <PanelSpinner height={480} size='large'/>
        if(categories.length > 0){
            let category_render = [];
            categories.forEach((item, i) => {
                let Icon = ExpertsIcons28[item.icon_id]
                category_render.push(
                    <Cell
                    expandable
                    multiline
                    mode={editing && "removable"}
                    onRemove={() => {
                        delCategory(item.id)
                    }}
                    key={item.id}
                    onClick={() => goCategory(item.id)}
                    before={<Icon />}
                    >
                        {item.title}
                    </Cell>
                )
            });
            return category_render;
        }else{
            return <Placeholder
            icon={<Icon56AdvertisingOutline />}>
                Пока данный раздел пустует. Мы уверены, скоро тут появятся вопросы.
            </Placeholder>
        }
    }
    useEffect(() => {
        
        getCategories()
        // eslint-disable-next-line
    },[])
    return(
        <Panel id={props.id}>
            <PanelHeader
            left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Категории
            </PanelHeader>
            <Group>
                {Categories()}
            </Group>
            {admin_permission && <Group>
                <CellButton before={<Icon28EditOutline />}
                    onClick={() => setEditing(pv => !pv)}>
                        {editing ? "Готово" : "Редактировать категории"}
                </CellButton>
                <CellButton before={<Icon28AddOutline />}
                onClick={() => goPanel(activeStory, 'faqCreateCategory', true)}>
                    Добавить категорию
                </CellButton>
                <CellButton before={<Icon28AddOutline />}
                onClick={() => goPanel(activeStory, 'faqCreateQuestion', true)}>
                    Добавить вопрос
                </CellButton>
                </Group>}
            
    
        </Panel>
    )
}