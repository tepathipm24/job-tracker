import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Status } from '../../status/entities/status.entity';


@Entity('applications', {schema: 'jobtracker'})
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'company_name', type: 'text'})
    companyName: string

    @Column({ name: 'job_title', type: 'text'})
    jobTitle: string

    @Column({ name: 'applied_date', type: 'date', nullable: true})
    appliedDate: Date

    @Column({ name: 'status_id'})
    statusId: number

    @ManyToOne(() => Status, status => status.applications)
    @JoinColumn({name : 'status_id'})
    status: Status;

    @Column({ name: 'interview_date', type: 'date', nullable: true })
    interviewDate: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}