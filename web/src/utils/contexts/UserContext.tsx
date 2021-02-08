import React, { createContext, useReducer } from 'react';
// this is an example context
export const UserContext = createContext({});

const userReducer = (state: any, action: { type: any; user: any }) => {
	switch (action.type) {
		case 'setUser':
			state = action.user;
			return state;
		case 'removeUser':
			state = {}
			return state
		default:
			return state;
	}
};

const UserContextProvider = (props: { children: React.ReactNode; }) => {
	const [user, dispatch] = useReducer(userReducer, {});

	return <UserContext.Provider value={{ user, dispatch }}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
