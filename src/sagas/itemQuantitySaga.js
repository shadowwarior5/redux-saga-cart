import { takeLatest, select, put, call } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';

import {
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  setItemQuantityFetchStatus,
  decreaseItemQuantity,
  FETCHING, FETCHED
} from '../actions';

import {
  currentUserSelector
} from '../selectors';

export function* handleIncreaseItemQuantity({id}) {
  yield put(setItemQuantityFetchStatus(FETCHING));
  const user = yield select(currentUserSelector);
  const response = yield call(fetch, `http://localhost:8081/cart/add/${user.get('id')}/${id}`);

  if (response.status !== 200) {
    yield put(decreaseItemQuantity(id, true));
    alert("Sorry");
  }
  yield put(setItemQuantityFetchStatus(FETCHED));
}

export function* handleDecreaseItemQuantity({id}) {
  yield put(setItemQuantityFetchStatus(FETCHING));
  const user = yield select(currentUserSelector);
  yield call(fetch, `http://localhost:8081/cart/remove/${user.get('id')}/${id}`);
  yield put(setItemQuantityFetchStatus(FETCHED));
}

export function* increaseItemQuantitySaga(){
  yield takeLatest(INCREASE_ITEM_QUANTITY, handleIncreaseItemQuantity);
}


export function* decreaseItemQuantitySaga(){
  yield takeLatest(DECREASE_ITEM_QUANTITY, handleDecreaseItemQuantity);
}