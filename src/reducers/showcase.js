import update from 'immutability-helper';

import {
  LIST_SHOWCASE,
} from '../actions/types';

const INITIAL_STATE = {
  cards: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_SHOWCASE:
      return update(
        state,
        {
          cards: action.payload,
        },
      );
    default:
      return state;
  }
};
