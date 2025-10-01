import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employees.entity';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService],
  controllers: [EmployeesController]
})
export class EmployeesModule { }
