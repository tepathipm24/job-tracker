// src/statuses/entities/status.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity'; // Import Application entity to define relationship

@Entity('statuses', { schema: 'jobtracker' }) // Decorator: Maps this class to the 'statuses' table in 'jobtracker' schema
export class Status {
  @PrimaryGeneratedColumn() // Decorator: Primary key, auto-generated
  id: number; // Property for 'id'

  @Column({ type: 'character varying', length: 50 }) // Decorator: Maps to 'label' column with type 'character varying' and max length 50
  label: string; // Property for 'label'

  @OneToMany(() => Application, application => application.status) // Decorator: Defines a One-to-Many relationship with 'Application' entity
  applications: Application[]; // Property representing a collection of related Application objects (lazily loaded)
}
