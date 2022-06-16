import { combineReducers } from "redux";
import {
    accountReducer as account,
    viewsReducer as views,
    faqReducer as Faq,
    storageReducer as stor,

} from "./main";

export const reducers = combineReducers({
    account,
    views,
    Faq,
    stor,
})