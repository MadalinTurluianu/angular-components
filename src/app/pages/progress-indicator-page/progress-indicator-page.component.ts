import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressIndicatorComponent } from '../../components/progress-indicator/progress-indicator.component';

@Component({
  selector: 'app-progress-indicator-page',
  standalone: true,
  imports: [RouterOutlet, ProgressIndicatorComponent],
  templateUrl: './progress-indicator-page.component.html',
  styleUrl: './progress-indicator-page.component.css',
})
export class ProgressIndicatorPageComponent {
  input1 = {
    color: '#71a8ff',
    progress: 30,
    radius: 50,
  };

  input2 = {
    color: '#71a8ff',
    progress: 60,
    radius: 50,
  };

  input3 = {
    color: '#71a8ff',
    progress: 81,
    radius: 50,
  };

  updateInput1Color(event: Event) {
    this.input1.color = (event.target as HTMLInputElement).value;
  }

  updateInput2Color(event: Event) {
    this.input2.color = (event.target as HTMLInputElement).value;
  }

  updateInput3Color(event: Event) {
    this.input3.color = (event.target as HTMLInputElement).value;
    console.log(this.input3);
  }

  updateInput1Progress(event: Event) {
    this.input1.progress = Number((event.target as HTMLInputElement).value);
  }

  updateInput2Progress(event: Event) {
    this.input2.progress = Number((event.target as HTMLInputElement).value);
  }

  updateInput3Progress(event: Event) {
    this.input3.progress = Number((event.target as HTMLInputElement).value);
  }

  updateInput1Radius(event: Event) {
    this.input1.radius = Number((event.target as HTMLInputElement).value);
  }

  updateInput2Radius(event: Event) {
    this.input2.radius = Number((event.target as HTMLInputElement).value);
  }

  updateInput3Radius(event: Event) {
    this.input3.radius = Number((event.target as HTMLInputElement).value);
  }
}
