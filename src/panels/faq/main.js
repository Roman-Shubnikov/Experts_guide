import React, {useEffect, useState} from 'react';
import { 

} from '@vkontakte/icons';
import {
    Button,
    Group,
    Header,
    Link,
    Panel,
    PanelHeader,
    PanelSpinner,
    Placeholder,
    Search,
    SimpleCell,
    Tabs,
    TabsItem,
    usePlatform,
    VKCOM,
    Div,
    Subhead,

} from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, GENERAL_LINKS} from '../../config';
import { faqActions } from '../../store/main';
import { NotePen28, SadlyEmoji } from '../../img/icons';
import QuestionList from './questionsList';
let lastTypingTime;
let typing = false;
let searchval = '';

export default props => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { activeCategory, searchResult, activeTab } = useSelector((state) => state.Faq)
    const setActiveTab = (tab) => dispatch(faqActions.setActiveTab(tab))
    const setSearchResult = (questions) => dispatch(faqActions.setSearchResultQuestions(questions))
    const { showErrorAlert, goPanel } = props.callbacks;
    const { goDisconnect } = props.navigation;
    const { activeStory } = useSelector((state) => state.views)
    const platform = usePlatform();

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
            .catch(goDisconnect)
    }
    useEffect(() => {
        console.log(activeCategory)
    }, [activeCategory])
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
    const setTab = (e) => {
        let tab = e.currentTarget.dataset.tab;
        setActiveTab(tab);
    }
    const isActiveTab = (tab) => {
        return activeTab === tab;
    }
    const content = () => {
        switch(activeTab) {
            case 'list':
                if(search.length > 0) return <Group>{Searched()}</Group>;
                return <QuestionList navigation={props.navigation} callbacks={props.callbacks} />;
            case 'question_curators':
                return (<>
                    <Group>
                        <Placeholder
                        icon={<NotePen28 size={56} />}
                        action={
                            <Button
                            href={GENERAL_LINKS.group_official_community}
                            target="_blank"
                            size='m'
                            rel="noopener noreferrer">
                                Задать вопрос
                            </Button>
                        }>
                            Чтобы задать вопрос кураторам программы экспертов ВКонтакте,
                            необходимо нажать на кнопку ниже и рассказать подробнее 
                            о вашей проблеме.
                        </Placeholder>
                    </Group>
                    <Group header={<Header>Рекомендация</Header>}>
                        <Div style={{paddingTop: 0}}>
                            <Subhead size={13} style={{color: '#818C99'}} weight='medium'>Чтобы ваш вопрос не затерялся в личных сообщениях рабочего сообщества,
                            рекомендуем написать <Link>#вопрос</Link> в чате своей тематики.</Subhead>
                        </Div>
                    </Group>
                    </>
                )
            default:
                return <QuestionList navigation={props.navigation} callbacks={props.callbacks} />;
        }
    }

    return(
        <Panel id={props.id}>
            <PanelHeader>
                {platform === VKCOM ? <Search value={search} placeholder='Введите ваш вопрос'
                onChange={(e) => {updateTyping();
                            searchval = e.currentTarget.value
                            setSearch(e.currentTarget.value)}} /> : "Помощь"}
            </PanelHeader>
            <Group>
                {platform !== VKCOM && <Search value={search} placeholder='Введите ваш вопрос'
                onChange={(e) => {updateTyping();
                            searchval = e.currentTarget.value
                            setSearch(e.currentTarget.value)}} />}
                <Tabs>
                    <TabsItem
                    selected={isActiveTab('list')}
                    data-tab='list'
                    onClick={setTab}>
                        Список вопросов
                    </TabsItem>
                    <TabsItem
                    selected={isActiveTab('question_curators')}
                    data-tab='question_curators'
                    onClick={setTab}>
                        Вопрос кураторам
                    </TabsItem>
                </Tabs>
                
            </Group>
            {content()}
            
        </Panel>
    )
}