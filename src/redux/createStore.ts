import { createStore, combineReducers } from 'redux';
import reducers from './reducers';

export default function createReduxStore({}) {
  const rootReducer = combineReducers(reducers);
  const store = createStore(rootReducer, []);
  return store;
}
