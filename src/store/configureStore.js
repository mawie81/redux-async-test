import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import { devTools, persistState } from 'redux-devtools';

import rootReducer from '../reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware( thunkMiddleware, loggerMiddleware),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);

export default function configureStore(initalState) {
  return createStoreWithMiddleware(rootReducer, initalState);
}
