/*
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import ReactotronList from '../../ReactotronConfig'

import reducer from './reducer'

const rootReducer = combineReducers({ reducer })
const store = createStore(rootReducer, compose(applyMiddleware(thunk), ReactotronList.createEnhancer()))

export default store
*/

import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import reducer from './reducer'
import thunk from 'redux-thunk'

const configureStore = preloadedState => {
    return createStore (
        reducer,
        preloadedState,
        compose (
            applyMiddleware(createLogger,thunk)
        )
    );
}

const store = configureStore();

export default store;
