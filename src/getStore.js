import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';

import { createLogger } from 'redux-logger';
import { Iterable } from 'immutable'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga';

import { getQuery } from './utility'
import { reducer } from './combineReducers';
import { defaultState } from './defaultState'
import { initSagas } from './initSagas';

const stateTransformer = (state) => {
    if (Iterable.isIterable(state)) return state.toJS();
    else return state;
};

const logger = createLogger({
    stateTransformer,
});

export const getStore = ()=>{
    const sagaMiddleWare = createSagaMiddleware();
    const middleWares = [sagaMiddleWare, thunk];
    if (getQuery()['logger']) { middleWares.push(logger)}
    const composables = [applyMiddleware(...middleWares)]
    const enhancer = compose(
        ... composables
    );
    const store = createStore(
        reducer,
        defaultState,
        enhancer
    );
    console.log("Saga working");
    initSagas(sagaMiddleWare);
    return store;
};