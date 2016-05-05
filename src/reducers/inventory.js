import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  isVisible: false,
  sourcesToggling: false,
  searchTerm: '',
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.INVENTORY_TOGGLE_VISIBILITY : {
    const { nextState } = action;
    return Object.assign({}, state, {isVisible: nextState});
  }
  case ActionTypes.INVENTORY_SEARCH : {
    const { searchTerm } = action;
    return Object.assign({}, state, {searchTerm: searchTerm});
  }
  case ActionTypes.INVENTORY_SOURCES_VISIBILITY : {
    const { nextState } = action;
    return Object.assign({}, state, {sourcesToggling: nextState});
  }
  default : {
    return state;
  }
  }
}
