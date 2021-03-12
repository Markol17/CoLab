import DataLoader from "dataloader";
import { UserProject } from "../entities/UserProject";
import { In } from "typeorm";
import { User } from "../entities/User";

const batchUsers = async (projectIds: readonly number[]) => {
	const projectUsers = await UserProject.find({
		join: {
			alias: "userProject",
			innerJoinAndSelect: {
				user: "userProject.user",
			},
		},
		where: {
			//@ts-ignore
			projectId: In(projectIds),
		},
	});
	const projectIdToUsers: { [key: number]: User[] } = {};

	projectUsers.forEach((pu) => {
		if (pu.projectId in projectIdToUsers) {
			projectIdToUsers[pu.projectId].push((pu as any).__user__);
		} else {
			projectIdToUsers[pu.projectId] = [(pu as any).__user__];
		}
	});
	const mapping = projectIds.map((projectId) => projectIdToUsers[projectId]);

	return mapping;
};

export const createProjectMembersLoader = () => new DataLoader(batchUsers);
