import { Injectable, Component } from '@angular/core';

@Component({
    selector: 'loading',
    template: `
<div class="loading-indicator">
  <mat-progress-spinner mode="indeterminate" color="primary"></mat-progress-spinner>
</div>
`,
    styleUrls: ['./spinner.service.scss']
})
export class SpinnerService {

  constructor() { }

}
