import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Project } from "./Project";
import { Category } from "./Category";

@Entity()
export class ProjectCategory extends BaseEntity {
	@PrimaryColumn()
	projectId: number;

	@PrimaryColumn()
	categoryId: number;

	@ManyToOne(() => Project, (project) => project.categoryConnection, {
		primary: true,
	})
	@JoinColumn({ name: "projectId" })
	project: Promise<Project>;

	@ManyToOne(() => Category, (category) => category.projectConnection, {
		primary: true,
	})
	@JoinColumn({ name: "categoryId" })
	category: Promise<Category>;
}
