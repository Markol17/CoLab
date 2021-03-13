import DataLoader from "dataloader";
import { Link } from "../entities/Link";
import { In } from "typeorm";

const batchLinks = async (sectionIds: readonly number[]) => {
	const sectionLinks = await Link.find({
		where: {
			//@ts-ignore
			sectionId: In(sectionIds),
		},
	});

	const sectionIdToLinks: { [key: number]: Link[] } = {};

	sectionLinks.forEach((sl) => {
		if (sl.id in sectionIdToLinks) {
			sectionIdToLinks[sl.id].push(sl);
		} else {
			sectionIdToLinks[sl.id] = [sl];
		}
	});
	const mapping = sectionIds.map((sectionId) => sectionIdToLinks[sectionId]);
	return mapping;
};

export const createSectionLinksLoader = () => new DataLoader(batchLinks);
