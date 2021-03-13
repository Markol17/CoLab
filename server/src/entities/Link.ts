import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Section } from "./Section";

@ObjectType()
@Entity()
export class Link extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	title: string;

	@Field()
	@Column()
	url: string;

	@CreateDateColumn()
	createdAt: Date;

	@CreateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Section, (section) => section.links)
	section: Promise<Section>;
}
