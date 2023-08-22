import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store, persistor} from "./Redux/store.tsx"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
  <BrowserRouter>
  <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
  </BrowserRouter>
  </Provider>,
)
