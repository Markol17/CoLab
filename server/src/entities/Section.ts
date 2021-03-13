import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Project } from "./Project";
import { Link } from "./Link";

@ObjectType()
@Entity()
export class Section extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@CreateDateColumn()
	createdAt: Date;

	@CreateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Project, (project) => project.sections)
	project: Promise<Project>;

	@OneToMany(() => Link, (link) => link.section)
	links: Link[];
}
