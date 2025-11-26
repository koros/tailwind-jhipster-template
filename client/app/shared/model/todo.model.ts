import dayjs from 'dayjs';
import { TodoStatus } from 'app/shared/model/enumerations/todo-status.model';
import { Priority } from 'app/shared/model/enumerations/priority.model';

export interface ITodo {
  id?: number;
  title?: string;
  description?: string | null;
  status?: keyof typeof TodoStatus;
  priority?: keyof typeof Priority;
  dueDate?: dayjs.Dayjs | null;
  completed?: boolean;
}

export const defaultValue: Readonly<ITodo> = {
  completed: false,
};
