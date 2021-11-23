import {
    accountActionTypes,
    viewsActionTypes,
    faqActionTypes,
    } from './ActionTypes';

export const accountActions = {
    setUser: (payload) => ({type: accountActionTypes.SET_USER, payload}),
    setScheme: (payload) => ({type: accountActionTypes.SET_SCHEME, payload}),
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
}

export const faqActions = {
    setActiveTab: (payload) => ({type: faqActionTypes.SET_ACTIVE_TAB, payload}),
    setCategories: (payload) => ({type: faqActionTypes.SET_CATEGORIES, payload}),
    setActiveCategory: (payload) => ({type: faqActionTypes.SET_ACTIVE_CATEGORY, payload}),
    setActiveQuestion: (payload) => ({type: faqActionTypes.SET_ACTIVE_QUESTION, payload}),
    setQuestions: (payload) => ({type: faqActionTypes.SET_QUESTIONS, payload}),
    setSearchResultQuestions: (payload) => ({type: faqActionTypes.SET_SEARCH_RESULT_QUESTION, payload}),

}
