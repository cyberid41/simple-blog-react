const LOAD = 'redux-example/blogs/LOAD';
const LOAD_SUCCESS = 'redux-example/blogs/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/blogs/LOAD_FAIL';
const EDIT_START = 'redux-example/blogs/EDIT_START';
const EDIT_STOP = 'redux-example/blogs/EDIT_STOP';
const SAVE = 'redux-example/blogs/SAVE';
const SAVE_SUCCESS = 'redux-example/blogs/SAVE_SUCCESS';
const SAVE_FAIL = 'redux-example/blogs/SAVE_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  data: [{"_id":"f8b1a7cb-8f60-4d96-b1ab-cd74fbd1a5a5","title":"Belajar Reactjs dan Redux","slug":"belajar-reactjs-dan-redux","body":"Ini adalah body untuk belajar reactjs dan redux","createdAt":{"$$date":1477058636933}}],
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result.data,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: typeof action.error === 'string' ? action.error : 'Error'
      };
    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.blogs && globalState.blogs.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client => client.get('/blogs') // params not used, just shown as demonstration
  };
}

export function save(widget) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: widget.id,
    promise: client => client.post('/blogs', {
      data: widget
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}
