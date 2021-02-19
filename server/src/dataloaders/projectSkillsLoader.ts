import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { ProjectSkill } from '../entities/ProjectSkill';
import { Skill } from '../entities/Skill';

const batchSkills = async (projectIds: readonly number[]) => {
	const projectSkills = await ProjectSkill.find({
		join: {
			alias: 'projectSkill',
			innerJoinAndSelect: {
				skill: 'projectSkill.skill',
			},
		},
		where: {
			//@ts-ignore
			projectId: In(projectIds),
		},
	});

	const projectIdToSkills: { [key: number]: Skill[] } = {};

	projectSkills.forEach((ps) => {
		if (ps.projectId in projectIdToSkills) {
			projectIdToSkills[ps.projectId].push((ps as any).__skill__);
		} else {
			projectIdToSkills[ps.projectId] = [(ps as any).__skill__];
		}
	});
	const mapping = projectIds.map((projectId) => projectIdToSkills[projectId]);
	return mapping;
};

export const createProjectSkillsLoader = () => new DataLoader(batchSkills);
