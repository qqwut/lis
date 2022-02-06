import { Component, ViewChild, ElementRef } from '@angular/core'
import { AppMainComponent } from '@app-root/app.main.component'
import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('animation', [
      state(
        'hidden',
        style({
          transform: 'translateY(20px)',
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          visibility: 'visible',
        })
      ),
      transition(
        'hidden <=> visible',
        animate('.4s cubic-bezier(.05,.74,.2,.99)')
      ),
    ]),
  ],
})
export class SearchComponent {
  @ViewChild('input') inputElement: ElementRef

  constructor(public appMain: AppMainComponent) {}

  onAnimationEnd(event: AnimationEvent) {
    if (event.toState === 'visible') {
      this.inputElement.nativeElement.focus()
    }
  }

  onInputKeydown(event) {
    const key = event.which

    // escape, tab and enter
    if (key === 27 || key === 9 || key === 13) {
      this.appMain.onSearchHide(event)
    }
  }
}
