import { TaskStatus } from '../entities/task.entity';

export class GetTasksFilterDto {
  status?: TaskStatus;
  search?: string;
}
