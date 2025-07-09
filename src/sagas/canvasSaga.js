import { call, put, takeLatest } from 'redux-saga/effects';
import {
  SAVE_CANVAS_SETTINGS,
  FETCH_CANVAS_SETTINGS
} from '../redux/actions/actionTypes';
import {
  saveCanvasSettingsSuccess,
  fetchCanvasSettingsSuccess
} from '../redux/actions';

// Mock API call function for saving canvas settings
const saveCanvasSettingsToApi = async (settings) => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Add an ID and timestamp to the settings
      const savedSettings = {
        ...settings,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      resolve(savedSettings);
    }, 500);
  });
};

// Mock API call function for fetching canvas settings
const fetchCanvasSettingsFromApi = async () => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would fetch from a server
      // For now, we'll return an empty array as the data would be stored in Redux
      resolve([]);
    }, 500);
  });
};

// Worker saga: will be fired on SAVE_CANVAS_SETTINGS actions
function* saveCanvasSettingsSaga(action) {
  try {
    // Call API
    const savedSettings = yield call(saveCanvasSettingsToApi, action.payload);
    // Dispatch success action with the received data
    yield put(saveCanvasSettingsSuccess(savedSettings));
  } catch (error) {
    console.error('Error saving canvas settings:', error);
    // We could add a failure action here if needed
  }
}

// Worker saga: will be fired on FETCH_CANVAS_SETTINGS actions
function* fetchCanvasSettingsSaga() {
  try {
    // Call API
    const settings = yield call(fetchCanvasSettingsFromApi);
    // Dispatch success action with the received data
    yield put(fetchCanvasSettingsSuccess(settings));
  } catch (error) {
    console.error('Error fetching canvas settings:', error);
    // We could add a failure action here if needed
  }
}

// Watcher saga: watches for canvas settings actions
export function* watchCanvasSettings() {
  yield takeLatest(SAVE_CANVAS_SETTINGS, saveCanvasSettingsSaga);
  yield takeLatest(FETCH_CANVAS_SETTINGS, fetchCanvasSettingsSaga);
}
