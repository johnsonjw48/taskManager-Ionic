import {User} from "../../core/auth/interfaces/user";

export interface Task {
  id: number,
  title: string,
  description: string,
  status: Status,
  createdAt: Date,
  updatedAt: Date,
  user: User
}

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
