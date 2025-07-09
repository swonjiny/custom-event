import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import dataReducer from './dataReducer';
import canvasReducer from './canvasReducer';

const rootReducer = combineReducers({
  counter: counterReducer,
  data: dataReducer,
  canvas: canvasReducer
});

export default rootReducer;
