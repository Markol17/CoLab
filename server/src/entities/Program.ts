import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";
import { School } from "./School";

@ObjectType()
@Entity()
export class Program extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	name!: string;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => User, (user) => user.program)
	users: Promise<User[]>;

	@Column()
	schoolId: number;

	@ManyToOne(() => School, (school) => school.programs)
	@JoinColumn({ name: "schoolId" })
	school: School;
}
