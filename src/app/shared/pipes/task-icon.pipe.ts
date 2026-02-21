import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../features/interfaces/task';

@Pipe({
  name: 'taskIcon',
  standalone: true
})
export class TaskIconPipe implements PipeTransform {
  transform(status: Status | string | undefined | null): string {
    if (!status) return 'help-circle-outline';

    switch (status) {
      case Status.DONE:
      case 'DONE':
        return 'checkmark-circle-outline';

      case Status.IN_PROGRESS:
      case 'IN_PROGRESS':
        return 'time-outline';

      case Status.PENDING:
      case 'PENDING':
        return 'alert-circle-outline';

      default:
        return 'help-circle-outline';
    }
  }
}
