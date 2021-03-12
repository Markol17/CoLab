import React, { createContext, useReducer } from 'react';

export const ModalsContext = createContext<{
	login: boolean;
	register: boolean;
	learnMore: boolean;
	dispatch: React.Dispatch<any>;
}>({ login: false, register: false, learnMore: false, dispatch: () => null });

export const TOGGLE_LOGIN = 'toggleLogin';
export const TOGGLE_REGISTER = 'toggleRegister';
export const TOGGLE_LEARNMORE = 'toggleLearnMore';
const ModalsReducer = (state: { login: boolean; register: boolean; learnMore: boolean }, action: { type: string }) => {
	switch (action.type) {
		case TOGGLE_LOGIN:
			return { ...state, login: !state.login };
		case TOGGLE_REGISTER:
			return { ...state, register: !state.register };
		case TOGGLE_LEARNMORE:
			return { ...state, learnMore: !state.learnMore };
		default:
			return state;
	}
};

const ModalsContextProvider = (props: { children: React.ReactNode }) => {
	const [modalValues, dispatch] = useReducer(ModalsReducer, { login: false, register: false, learnMore: false });

	return <ModalsContext.Provider value={{ ...modalValues, dispatch }}>{props.children}</ModalsContext.Provider>;
};

export default ModalsContextProvider;
