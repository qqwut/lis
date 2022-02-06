import { Component, OnInit } from '@angular/core'
import { AppComponent } from '@app-root/app.component'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(public app: AppComponent) {}

  ngOnInit(): void {}
}
