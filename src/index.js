import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';
import { Provider } from "react-redux";
import {store} from "./store"
const root = document.getElementById('root');
if(platform() === IOS) {
    mVKMiniAppsScrollHelper(root); 
}
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
const ReduxApp = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)
  
ReactDOM.render(<ReduxApp/>, root);
