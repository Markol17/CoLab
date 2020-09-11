import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Project } from './Project';
import { Skill } from './Skill';

@Entity()
export class ProjectSkill extends BaseEntity {
  @PrimaryColumn()
  projectId: number;

  @PrimaryColumn()
  skillId: number;

  @ManyToOne(() => Project, (project) => project.skillConnection, {
    primary: true,
  })
  @JoinColumn({ name: 'projectId' })
  project: Promise<Project>;

  @ManyToOne(() => Skill, (skill) => skill.projectConnection, {
    primary: true,
  })
  @JoinColumn({ name: 'skillId' })
  skill: Promise<Skill>;
}
