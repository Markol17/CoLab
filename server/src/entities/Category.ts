import { ObjectType, Field } from "type-graphql";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	OneToMany,
} from "typeorm";
import { ProjectCategory } from "./ProjectCategory";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	name: string;

	@Field()
	@Column()
	color: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => ProjectCategory, (pc) => pc.category)
	projectConnection: Promise<ProjectCategory[]>;
}
