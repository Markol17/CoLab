import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";
import { Program } from "./Program";
import { Project } from "./Project";

@ObjectType()
@Entity()
export class School extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ unique: true })
	name: string;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => User, (user) => user.school)
	users: Promise<User[]>;

	@OneToMany(() => Program, (program) => program.school)
	programs: Promise<Program[]>;

	@OneToMany(() => Project, (project) => project.school)
	projects: Promise<Project[]>;
}
