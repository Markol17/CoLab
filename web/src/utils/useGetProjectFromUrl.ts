import { useProjectQuery } from '../generated/graphql';
import { useGetIntId } from './useGetIntId';

export const useGetProjectFromUrl = () => {
	const intId = useGetIntId();
	return useProjectQuery({
		// pause: intId === -1,
		variables: {
			id: intId,
		},
	});
};
