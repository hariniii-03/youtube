import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchScore',
  standalone: true
})
export class MatchScorePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return `${value}% Match`;
  }
}
