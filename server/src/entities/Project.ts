import { ObjectType, Field, Ctx, Int } from 'type-graphql';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';
import { ProjectSkill } from './ProjectSkill';
import { Context } from 'src/types';
import { ProjectCategory } from './ProjectCategory';
import { Skill } from './Skill';
import { UserProject } from './UserProject';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column()
	name!: string;

	@Field()
	@Column()
	desc!: string;

	@Field(() => Int)
	@Column({ type: 'int', default: 0 })
	points: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	thumbnail?: string;

	@Field(() => Int)
	@Column({ default: 30 })
	limit: number;

	@Field()
	@Column()
	creatorId: number;

	@Field()
	@ManyToOne(() => User, (user) => user.projects)
	creator: User;

	@OneToMany(() => ProjectSkill, (ps) => ps.project)
	skillConnection: Promise<ProjectSkill[]>;

	@Field(() => [Skill])
	async skills(@Ctx() { projectSkillsLoader }: Context): Promise<Skill[]> {
		return projectSkillsLoader.load(this.id);
	}

	@OneToMany(() => ProjectCategory, (pc) => pc.project)
	categoryConnection: Promise<ProjectCategory[]>;

	@Field(() => [Category])
	async categories(@Ctx() { projectCategoriesLoader }: Context): Promise<Category[]> {
		return projectCategoriesLoader.load(this.id);
	}

	@OneToMany(() => UserProject, (up) => up.project)
	memberConnection: Promise<UserProject[]>;

	@Field(() => [User])
	async members(@Ctx() { projectMembersLoader }: Context): Promise<User[]> {
		return projectMembersLoader.load(this.id);
	}

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
