import { combineReducers } from "redux";
import {
    accountReducer as account,
    viewsReducer as views,
    faqReducer as Faq,

} from "./main";

export const reducers = combineReducers({
    account,
    views,
    Faq,
})