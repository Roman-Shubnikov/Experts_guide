import {
    accountActionTypes, 
    viewsActionTypes, 
    faqActionTypes,
} from "./ActionTypes";

const initalStateAccount = {
    user: {},
    schemeSettings: {
        scheme: "bright_light",
        default_scheme: "bright_light",
    },

}
const initalStateViews = {
    scheme: "bright_light",
    default_scheme: "bright_light",
    activeStory: 'loading',
    activePanel: 'load',
    historyPanels: [{view: 'home', panel: 'home'}],
    snackbar: null,
    need_epic: true,
    historyPanelsView: ['home'],
}


const initalStateFaq = {
    activeTab: 'list',
    categories: null,
    questions: null,
    activeCategory: null,
    activeQuestion: null, 
    searchResult: null,

}

export const accountReducer = (state = initalStateAccount, action) => {
    switch(action.type) {
        case accountActionTypes.SET_USER:
            return {...state, user: action.payload}
        case accountActionTypes.SET_SCHEME:
            return { ...state, schemeSettings: {...state.schemeSettings, ...action.payload}}
        default: 
            return state

    }
}
export const viewsReducer = (state = initalStateViews, action) => {
    switch(action.type) {
        case viewsActionTypes.SET_ACTIVE_STORY:
            return {...state, activeStory: action.payload}
        case viewsActionTypes.SET_ACTIVE_PANEL:
            return {...state, activePanel: action.payload}
        case viewsActionTypes.SET_ACTIVE_SCENE:
            return {...state, activePanel: action.payload.panel, activeStory: action.payload.story}
        case viewsActionTypes.SET_HISTORY:
            let viewHistory = action.payload.map((obj, i) => obj.panel)
            return {...state, historyPanels: action.payload, historyPanelsView: viewHistory}
        case viewsActionTypes.SET_NEED_EPIC:
            return {...state, need_epic: action.payload}
        case viewsActionTypes.SET_SNACKBAR:
            return {...state, snackbar: action.payload}
        default: 
            return state
    }
}

export const faqReducer = (state = initalStateFaq, action) => {
    switch (action.type) {
        case faqActionTypes.SET_CATEGORIES:
            return { ...state, categories: action.payload }
        case faqActionTypes.SET_ACTIVE_TAB:
            return { ...state, activeTab: action.payload }
        case faqActionTypes.SET_QUESTIONS:
            return { ...state, questions: action.payload }
        case faqActionTypes.SET_ACTIVE_CATEGORY:
            return { ...state, activeCategory: action.payload }
        case faqActionTypes.SET_ACTIVE_QUESTION:
            return { ...state, activeQuestion: action.payload }
        case faqActionTypes.SET_SEARCH_RESULT_QUESTION:
            return { ...state, searchResult: action.payload }
        default:
            return state
    }
}