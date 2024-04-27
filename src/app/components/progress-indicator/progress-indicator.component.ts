import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-progress-indicator',
  standalone: true,
  imports: [],
  templateUrl: './progress-indicator.component.html',
  styleUrl: './progress-indicator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressIndicatorComponent {
  @Input() radius!: number;
  @Input() progress!: number;
  @Input() color!: string;
  @Input() hollow: boolean = true;
  @Input() showProgress: boolean = true;

  @Output() complete = new EventEmitter<void>();

  ngOnChanges() {
    if (this.progress >= 100) {
      this.complete.emit();
    }
  }

  ngOnInit() {
    if (this.radius < 50) this.radius = 50;
    if (this.progress > 100) this.progress = 100;
    if (this.progress < 0) this.progress = 0;
  }
}
