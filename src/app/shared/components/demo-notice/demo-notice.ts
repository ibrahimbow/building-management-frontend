import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-notice',
  standalone: true,
  templateUrl: './demo-notice.html',
  styleUrl: './demo-notice.scss'
})
export class DemoNotice {

  showDemoNotice = localStorage.getItem(
    'joritna_demo_notice_accepted'
  ) !== 'true';

  understandDemoNotice(): void {
    this.showDemoNotice = false;

    localStorage.setItem(
      'joritna_demo_notice_accepted',
      'true'
    );
  }
}