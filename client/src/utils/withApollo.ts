import { createWithApollo } from './createWithApollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PaginatedProjects } from '../generated/graphql';
import { NextPageContext } from 'next';
import { createUploadLink } from 'apollo-upload-client';

const createClient = (ctx: NextPageContext) =>
	new ApolloClient({
		connectToDevTools: true,
		link: createUploadLink({
			uri: process.env.NEXT_PUBLIC_API_URL as string,
			credentials: 'include',
			headers: {
				cookie: (typeof window === 'undefined' ? ctx?.req?.headers.cookie : undefined) || '',
			},
		}),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						paginatedProjects: {
							keyArgs: [],
							merge(existing: PaginatedProjects | undefined, incoming: PaginatedProjects): PaginatedProjects {
								return {
									...incoming,
									projects: [...(existing?.projects || []), ...incoming.projects],
								};
							},
						},
					},
				},
			},
		}),
	});

export const withApollo = createWithApollo(createClient);
