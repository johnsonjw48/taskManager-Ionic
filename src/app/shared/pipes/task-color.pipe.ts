import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../features/interfaces/task';

@Pipe({
  name: 'taskColor',
  standalone: true
})
export class TaskColorPipe implements PipeTransform {
  transform(status: Status | string | undefined | null): string {
    if (!status) return 'medium';

    switch (status) {
      case Status.DONE:
      case 'DONE': 
        return 'success';
      
      case Status.IN_PROGRESS:
      case 'IN_PROGRESS':
        return 'warning';
      
      case Status.PENDING:
      case 'PENDING':
        return 'danger';
      
      default:
        return 'medium';
    }
  }
}
