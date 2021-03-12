import React, { createContext, useReducer } from 'react';

export const PaginationsContext = createContext<{
	home: number;
	explore: number;
	dispatch: React.Dispatch<any>;
}>({ home: 12, explore: 12, dispatch: () => null });

export const SET_HOME = 'setHome';
export const SET_EXPLORE = 'setExplore';
const PaginationsReducer = (state: { home: 12; explore: 12 }, action: { type: string; offset: number }) => {
	switch (action.type) {
		case SET_HOME:
			return { ...state, home: state.home + action.offset };
		case SET_EXPLORE:
			return { ...state, explore: state.explore + action.offset };
		default:
			return state;
	}
};

const PaginationsContextProvider = (props: { children: React.ReactNode }) => {
	// @ts-ignore
	const [paginationValues, dispatch] = useReducer(PaginationsReducer, { home: 12, explore: 12 });

	return (
		<PaginationsContext.Provider value={{ ...paginationValues, dispatch }}>
			{props.children}
		</PaginationsContext.Provider>
	);
};

export default PaginationsContextProvider;
