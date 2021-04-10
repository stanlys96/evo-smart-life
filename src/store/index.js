import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import goodsReducer from './reducers/goods';

const rootReducer = combineReducers({
  goods: goodsReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;