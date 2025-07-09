import {
  SAVE_CANVAS_SETTINGS,
  SAVE_CANVAS_SETTINGS_SUCCESS,
  LOAD_CANVAS_SETTINGS,
  FETCH_CANVAS_SETTINGS,
  FETCH_CANVAS_SETTINGS_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  settings: [],
  currentSettings: null,
  loading: false,
  error: null
};

const canvasReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CANVAS_SETTINGS:
      return {
        ...state,
        loading: true
      };
    case SAVE_CANVAS_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: [...state.settings, action.payload]
      };
    case LOAD_CANVAS_SETTINGS: {
      const selectedSettings = state.settings.find(setting => setting.id === action.payload);
      return {
        ...state,
        currentSettings: selectedSettings || state.currentSettings
      };
    }
    case FETCH_CANVAS_SETTINGS:
      return {
        ...state,
        loading: true
      };
    case FETCH_CANVAS_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: action.payload
      };
    default:
      return state;
  }
};

export default canvasReducer;
