import { ObjectType, Field, Ctx } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Project } from './Project';
import { Skill } from './Skill';
import { UserSkill } from './UserSkill';
import { Context } from 'src/types';

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
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field(() => [Project])
  @OneToMany(() => Project, (project) => project.creator)
  projects: Project[];

  @OneToMany(() => UserSkill, (us) => us.project)
  skillConnection: Promise<UserSkill[]>;

  @Field(() => [Skill])
  async skills(@Ctx() { userSkillsLoader }: Context): Promise<Skill[]> {
    return userSkillsLoader.load(this.id);
  }

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
