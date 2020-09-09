import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { Project } from './Project';

@ObjectType()
@Entity()
export class Skill extends BaseEntity {
  @Field()
  @Column({ unique: true })
  type!: string;

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.skills)
  user: User;

  @ManyToOne(() => Project, (project) => project.skills)
  project: Project;
}
