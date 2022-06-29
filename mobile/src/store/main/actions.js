import { appStorageActionTypes } from '.';
import {
    accountActionTypes,
    viewsActionTypes,
    faqActionTypes,
    } from './ActionTypes';

export const accountActions = {
    setUser: (payload) => ({type: accountActionTypes.SET_USER, payload}),
    setScheme: (payload) => ({type: accountActionTypes.SET_SCHEME, payload}),
    setCurators: (payload) => ({type: accountActionTypes.SET_CURATORS, payload}),
    setActiveTopic: (payload) => ({type: accountActionTypes.SET_ACTIVE_TOPIC, payload}),
    setTokenSearch: (payload) => ({type: accountActionTypes.SET_TOKEN_SEARCH, payload}),
    setTopicsFriends: (payload) => ({type: accountActionTypes.SET_FRIENDS_TOPICS, payload}),
    setStatistic: (payload) => ({ type: accountActionTypes.SET_STATISTIC, payload}),
}

export const viewsActions = {
    setActiveStory: (payload) => ({ type: viewsActionTypes.SET_ACTIVE_STORY, payload}),
    setActivePanel: (payload) => ({ type: viewsActionTypes.SET_ACTIVE_PANEL, payload}),
    setActiveScene: (story, panel) => {
        let payload = {story, panel};
        return { type: viewsActionTypes.SET_ACTIVE_SCENE, payload}},
    setHistory: (payload) => ({ type: viewsActionTypes.SET_HISTORY, payload}),
    setNeedEpic: (payload) => ({ type: viewsActionTypes.SET_NEED_EPIC, payload}),
    setSnackbar: (payload) => ({ type: viewsActionTypes.SET_SNACKBAR, payload}),
    setCurrentModal: (payload) => ({ type: viewsActionTypes.SET_CURRENT_MODAL, payload}),
    setHistoryModals: (payload) => ({ type: viewsActionTypes.SET_MODAL_HISTORY, payload}),
    
}

export const faqActions = {
    setActiveTab: (payload) => ({type: faqActionTypes.SET_ACTIVE_TAB, payload}),
    setCategories: (payload) => ({type: faqActionTypes.SET_CATEGORIES, payload}),
    setActiveCategory: (payload) => ({type: faqActionTypes.SET_ACTIVE_CATEGORY, payload}),
    setActiveQuestion: (payload) => ({type: faqActionTypes.SET_ACTIVE_QUESTION, payload}),
    setQuestions: (payload) => ({type: faqActionTypes.SET_QUESTIONS, payload}),
    setSearchResultQuestions: (payload) => ({type: faqActionTypes.SET_SEARCH_RESULT_QUESTION, payload}),

}

export const storActions = { 
    setScoreData: (payload) => ({type: appStorageActionTypes.SET_SCORE, payload}),
    setTopics: (payload) => ({type: appStorageActionTypes.SET_TOPICS, payload}),
    setFormats: (payload) => ({type: appStorageActionTypes.SET_FORMATS, payload}),
    setPosts: (payload) => ({type: appStorageActionTypes.SET_POSTS, payload}),
}