import { ObjectType, Field, Int } from "type-graphql";
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Project } from "./Project";
import { Skill } from "./Skill";
import { UserSkill } from "./UserSkill";
import { UserProject } from "./UserProject";
import { School } from "./School";
import { Program } from "./Program";

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
	@Column()
	firstName!: string;

	@Field()
	@Column()
	lastName!: string;

	@Field()
	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@Column({ type: "date" })
	startDateOfStudy!: Date;

	@Column({ type: "date" })
	expectedGraduationDate!: Date;

	@Field(() => Int)
	yearOfStudy: number;

	@Column()
	schoolId: number;

	@Field(() => School)
	@ManyToOne(() => School, (school) => school.users)
	@JoinColumn({ name: "schoolId" })
	school: School;

	@Column()
	programId: number;

	@Field(() => Program)
	@ManyToOne(() => Program, (program) => program.users)
	@JoinColumn({ name: "programId" })
	program: Program;

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

	@Field(() => Date)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => Date)
	@UpdateDateColumn()
	updatedAt: Date;
}
