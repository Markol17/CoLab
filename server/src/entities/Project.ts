import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Skill } from './Skill';
import { Category } from './Category';

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

  @Field()
  @Column({ type: 'int', default: 0 })
  points: number;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.projects)
  creator: User;

  @Field(() => [Skill])
  @OneToMany(() => Skill, (skill) => skill.project)
  skills: Skill[];

  @Field(() => [Category])
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
