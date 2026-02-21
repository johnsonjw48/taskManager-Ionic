import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../features/interfaces/task';

@Pipe({
  name: 'taskStatus',
  standalone: true
})
export class TaskStatusPipe implements PipeTransform {
  transform(status: Status | string | undefined | null): string {
    if (!status) return 'Inconnu';

    switch (status) {
      case Status.DONE:
      case 'DONE':
        return 'Terminée';

      case Status.IN_PROGRESS:
      case 'IN_PROGRESS':
        return 'En cours';

      case Status.PENDING:
      case 'PENDING':
        return 'À faire';

      default:
        return 'Inconnu';
    }
  }
}
