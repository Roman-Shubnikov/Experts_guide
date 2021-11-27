import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';
import { Provider } from "react-redux";
import {store} from "./store"
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://485e8e0a7ac54f07ad08fe251608d566@o461731.ingest.sentry.io/5997211",
    integrations: [new Integrations.BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
  });
}


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
