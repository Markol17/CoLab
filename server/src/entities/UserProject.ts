import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity()
export class UserProject extends BaseEntity {
	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	projectId: number;

	@ManyToOne(() => User, (user) => user.projectConnection, {
		primary: true,
	})
	@JoinColumn({ name: "userId" })
	user: Promise<User>;

	@ManyToOne(() => Project, (project) => project.memberConnection, {
		primary: true,
	})
	@JoinColumn({ name: "projectId" })
	project: Promise<Project>;
}
