import React, { createContext, useReducer } from 'react';

export const ModalsContext = createContext<{
	login: boolean;
	register: boolean;
	dispatch: React.Dispatch<any>;
  }>({login: false, register: false, dispatch: () => null});
  
export const TOGGLE_LOGIN = 'toggleLogin';
export const TOGGLE_REGISTER = 'toggleRegister';
const ModalsReducer = (state: { login: boolean, register: boolean }, action: { type: string;}) => {
	switch (action.type) {
		case TOGGLE_LOGIN:
			return {...state, login: !state.login};
		case TOGGLE_REGISTER:
			return {...state, register: !state.register};
		default:
			return state;
	}
};

const ModalsContextProvider = (props: { children: React.ReactNode; }) => {
	const [modalValues, dispatch] = useReducer(ModalsReducer, {login: false, register: false});

	return <ModalsContext.Provider value={{ ...modalValues, dispatch }}>{props.children}</ModalsContext.Provider>;
};

export default ModalsContextProvider;
