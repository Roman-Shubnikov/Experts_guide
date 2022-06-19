import React, { useState} from 'react';
import { 

} from '@vkontakte/icons';
import {
    Button,
    Group,
    Panel,
    PanelHeader,
    PanelSpinner,
    Placeholder,
    Search,
    SimpleCell,
    PanelHeaderBack,


} from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, GENERAL_LINKS} from '../../config';
import { faqActions } from '../../store/main';
import { SadlyEmoji } from '../../img/icons';
import QuestionList from './questionsList';
let lastTypingTime;
let typing = false;
let searchval = '';

export const Help = props => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { searchResult, activeCategory, categories } = useSelector((state) => state.Faq)
    const setSearchResult = (questions) => dispatch(faqActions.setSearchResultQuestions(questions))
    const { showErrorAlert, goPanel } = props.callbacks;
    const { goDisconnect } = props.navigation;
    const { activeStory } = useSelector((state) => state.views)

    const getSearchQuestions = () => {
        if(searchval.length <= 0) return;
        fetch(API_URL + "method=faq.getQuestionByName&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'name': searchval
            })
          })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setSearchResult(data.response)
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(err => {goDisconnect();console.log(err)})
    }
    const updateTyping = () => {
        if(!typing){
            typing = true;
            
        }
        lastTypingTime = (new Date()).getTime();
        setTimeout(() => {
            const typingTimer = (new Date()).getTime();
            const timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= 400 && typing) {
                typing = false;
                if(searchval.length === 0) {setSearchResult(null); return;}
                if(searchval.length <= 0) return;
                getSearchQuestions()
            }
        }, 600)

    }
    const goQuestion = (id) => {
        dispatch(faqActions.setActiveQuestion(id))
        goPanel(activeStory, 'faqQuestion', true)
    }
    const Searched = () => {
        if(!searchResult) return <PanelSpinner/>
        if(searchResult.length > 0){
            return searchResult.map((res, i) => 
            <SimpleCell
            expandable
            multiline
            key={res.id}
            onClick={() => goQuestion(res.id)}
            >
                {res.question}
            </SimpleCell>)
        }else{
            return <Placeholder
            icon={<SadlyEmoji size={56} />}
            header="Вопрос не найден"
            action={
            <Button href={GENERAL_LINKS.group_fan_community} 
            target="_blank"
            rel="noopener noreferrer">
                Задать вопрос
            </Button>}>
                Внимательно изучите свой вопрос на корректность, иногда могут прокрасться орфографические ошибки.
            </Placeholder>
        }
    }
    const content = () => {
        if(search.length > 0) return Searched();
        return <QuestionList navigation={props.navigation} callbacks={props.callbacks} />;
    }

    return(
        <Panel id={props.id}>
            <PanelHeader
            left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                {categories.find(v => v.id === activeCategory).title}
            </PanelHeader>
            <Group>
                <Search value={search} placeholder='Введите ваш вопрос'
                onChange={(e) => {updateTyping();
                            searchval = e.currentTarget.value
                            setSearch(e.currentTarget.value)}} />
            
                {content()}
            </Group>
        </Panel>
    )
}