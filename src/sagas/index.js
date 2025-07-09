import { all, fork } from 'redux-saga/effects';
import { watchFetchData } from './dataSaga';
import { watchCanvasSettings } from './canvasSaga';

// Root saga
export default function* rootSaga() {
  yield all([
    fork(watchFetchData),
    fork(watchCanvasSettings)
  ]);
}
