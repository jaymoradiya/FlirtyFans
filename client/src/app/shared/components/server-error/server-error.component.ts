import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css'],
})
export class ServerErrorComponent {
  error: { [k: string]: any } | null = null;
  constructor(private router: Router) {
    this.error = this.router.getCurrentNavigation()?.extras?.state?.['error'];
  }
}
