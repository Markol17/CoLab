import React, {createContext, useReducer} from 'react';

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children }: {children: React.ReactElement} ) => {
  const [state, dispatch] = useReducer((state: any, action: React.ReducerAction<any>) => {
    switch(action.type) {
      case 'currentUser':
        const newState = //;
        return newState;
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }