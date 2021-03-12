import { useUserQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetProfileFromUrl = () => {
	const intId = useGetIntId();
	return useUserQuery({
		// pause: intId === -1,
		variables: {
			id: intId,
		},
	});
};
