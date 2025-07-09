import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_DATA } from '../redux/actions/actionTypes';
import { fetchDataSuccess, fetchDataFailure } from '../redux/actions';

// Mock API call function
const fetchDataFromApi = async () => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]);
    }, 1000);
  });
};

// Worker saga: will be fired on FETCH_DATA actions
function* fetchDataSaga() {
  try {
    // Call API
    const data = yield call(fetchDataFromApi);
    // Dispatch success action with the received data
    yield put(fetchDataSuccess(data));
  } catch (error) {
    // Dispatch failure action with the error
    yield put(fetchDataFailure(error.message));
  }
}

// Watcher saga: watches for FETCH_DATA actions
export function* watchFetchData() {
  yield takeLatest(FETCH_DATA, fetchDataSaga);
}
