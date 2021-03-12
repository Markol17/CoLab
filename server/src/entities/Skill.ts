import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { ProjectSkill } from "./ProjectSkill";
import { UserSkill } from "./UserSkill";

@ObjectType()
@Entity()
export class Skill extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	type!: string;

	@Field()
	@Column()
	color!: string;

	@CreateDateColumn()
	createdAt: Date;

	@CreateDateColumn()
	updatedAt: Date;

	@OneToMany(() => UserSkill, (us) => us.skill)
	userConnection: Promise<UserSkill[]>;

	@OneToMany(() => ProjectSkill, (ps) => ps.skill)
	projectConnection: Promise<ProjectSkill[]>;
}
