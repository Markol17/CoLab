import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { ProjectSkill } from './ProjectSkill';
import { UserSkill } from './UserSkill';

@ObjectType()
@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  type!: string;

  @OneToMany(() => UserSkill, (us) => us.skill)
  userConnection: Promise<UserSkill[]>;

  @OneToMany(() => ProjectSkill, (ps) => ps.skill)
  projectConnection: Promise<ProjectSkill[]>;
}
