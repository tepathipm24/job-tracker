import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private applicationsRepository: Repository<Application>,
    ) { }

    findAll(): Promise<Application[]> {
        return this.applicationsRepository.find({ order:{ appliedDate: 'ASC'}, relations: ['status'] })
    }

    async paginate(page: number, limit: number): Promise<Application[] | any> {
        const [data, total] = await this.applicationsRepository.findAndCount({
            skip: (page - 1)* limit,
            take: limit,
            order: { appliedDate: 'ASC'},
            relations: ['status']
        })

        return {
            data,
            total,
            page,
            totalPage: Math.ceil(total / limit),
          };
    }

    async findOne(id: number): Promise<Application> {
        const application = await this.applicationsRepository.findOne({ where: { id }, relations: ['status'] })
        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found.`)
        }
        return application
    }

    async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
        const newApplication = this.applicationsRepository.create(createApplicationDto)
        return this.applicationsRepository.save(newApplication);
    }

    async update(id: number, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
        const application = await this.applicationsRepository.preload({
            id: id,
            ...updateApplicationDto,
        })

        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found.`);
        }

        if (updateApplicationDto.statusId === 4 && !updateApplicationDto.interviewDate) {
            throw new BadRequestException('Interview date is required when status is Interview Scheduled.');
        }

        return this.applicationsRepository.save(application)
    }

    async remove(id:number): Promise<void> {
        const result = await this.applicationsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Application with ID ${id} not found.`)
        }
    }
}
