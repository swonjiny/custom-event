import * as types from './actionTypes';

// Counter Actions
export const increment = () => ({
  type: types.INCREMENT
});

export const decrement = () => ({
  type: types.DECREMENT
});

// Data Fetching Actions
export const fetchData = () => ({
  type: types.FETCH_DATA
});

export const fetchDataSuccess = (data) => ({
  type: types.FETCH_DATA_SUCCESS,
  payload: data
});

export const fetchDataFailure = (error) => ({
  type: types.FETCH_DATA_FAILURE,
  payload: error
});

// Canvas Settings Actions
export const saveCanvasSettings = (settings) => ({
  type: types.SAVE_CANVAS_SETTINGS,
  payload: settings
});

export const saveCanvasSettingsSuccess = (settings) => ({
  type: types.SAVE_CANVAS_SETTINGS_SUCCESS,
  payload: settings
});

export const loadCanvasSettings = (id) => ({
  type: types.LOAD_CANVAS_SETTINGS,
  payload: id
});

export const fetchCanvasSettings = () => ({
  type: types.FETCH_CANVAS_SETTINGS
});

export const fetchCanvasSettingsSuccess = (settings) => ({
  type: types.FETCH_CANVAS_SETTINGS_SUCCESS,
  payload: settings
});
