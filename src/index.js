import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';

const root = document.getElementById('root');
if(platform() === IOS) {
    mVKMiniAppsScrollHelper(root); 
}
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
ReactDOM.render(<App/>, root);
