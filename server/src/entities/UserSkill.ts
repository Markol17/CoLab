import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Skill } from "./Skill";
import { User } from "./User";

@Entity()
export class UserSkill extends BaseEntity {
	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	skillId: number;

	@ManyToOne(() => User, (user) => user.skillConnection, {
		primary: true,
	})
	@JoinColumn({ name: "userId" })
	user: Promise<User>;

	@ManyToOne(() => Skill, (skill) => skill.userConnection, {
		primary: true,
	})
	@JoinColumn({ name: "skillId" })
	skill: Promise<Skill>;
}
