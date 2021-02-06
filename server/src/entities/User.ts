import { ObjectType, Field } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { Project } from './Project';
import { Skill } from './Skill';
import { UserSkill } from './UserSkill';
import { UserProject } from './UserProject';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	username!: string;

	@Field()
	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@OneToMany(() => UserSkill, (us) => us.skill)
	skillConnection: Promise<UserSkill[]>;

	@Field(() => [Skill])
	skills: Skill[];

	@OneToMany(() => UserProject, (up) => up.project)
	projectConnection: Promise<UserProject[]>;

	@Field(() => [Project])
	projects: Project[];

	@Field({ nullable: true })
	@Column({ nullable: true })
	avatar: string;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
