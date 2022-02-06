import { Component, OnDestroy } from '@angular/core'
import { MenuService } from './shared/services/menu/menu.service'
import { MenuItem, PrimeNGConfig } from 'primeng/api'
import { AppComponent } from './app.component'
import { Subscription } from 'rxjs'
import { BreadcrumbService } from '@app-shared/services/breadcrumb/breadcrumb.service'

@Component({
  selector: 'app-main',
  templateUrl: './app.main.component.html',
})
export class AppMainComponent implements OnDestroy {
  subscription: Subscription

  items: MenuItem[]

  overlayMenuActive: boolean

  staticMenuDesktopInactive: boolean

  staticMenuMobileActive: boolean

  menuClick: boolean

  search = false

  searchClick = false

  userMenuClick: boolean

  topbarUserMenuActive: boolean

  notificationMenuClick: boolean

  topbarNotificationMenuActive: boolean

  rightMenuClick: boolean

  rightMenuActive: boolean

  configActive: boolean

  configClick: boolean

  resetMenu: boolean

  signOutMenuClick: boolean

  signOutMenuActive: boolean

  menuHoverActive = false

  constructor(
    private menuService: MenuService,
    private primengConfig: PrimeNGConfig,
    public app: AppComponent,
    public breadcrumbService: BreadcrumbService
  ) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response
    })
  }

  onLayoutClick() {
    if (!this.searchClick) {
      this.search = false
    }

    if (!this.userMenuClick) {
      this.topbarUserMenuActive = false
    }

    if (!this.notificationMenuClick) {
      this.topbarNotificationMenuActive = false
    }

    if (!this.rightMenuClick) {
      this.rightMenuActive = false
    }

    if (!this.signOutMenuClick) {
      this.signOutMenuActive = false
    }

    if (!this.menuClick) {
      if (this.isSlim() || this.isHorizontal()) {
        this.menuService.reset()
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu()
      }

      this.menuHoverActive = false
      this.unblockBodyScroll()
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false
    }

    this.searchClick = false
    this.configClick = false
    this.userMenuClick = false
    this.rightMenuClick = false
    this.signOutMenuClick = false
    this.notificationMenuClick = false
    this.menuClick = false
  }

  onMenuButtonClick(event) {
    this.menuClick = true
    this.topbarUserMenuActive = false
    this.topbarNotificationMenuActive = false
    this.rightMenuActive = false

    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive
    }

    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive
      if (this.staticMenuMobileActive) {
        this.blockBodyScroll()
      } else {
        this.unblockBodyScroll()
      }
    }

    event.preventDefault()
  }

  onSearchClick(event) {
    this.search = !this.search
    this.searchClick = !this.searchClick
  }

  onSearchHide(event) {
    this.search = false
    this.searchClick = false
  }

  onMenuClick($event) {
    this.menuClick = true
    this.resetMenu = false
  }

  onTopbarUserMenuButtonClick(event) {
    this.userMenuClick = true
    this.topbarUserMenuActive = !this.topbarUserMenuActive

    this.hideOverlayMenu()

    event.preventDefault()
  }

  onTopbarNotificationMenuButtonClick(event) {
    this.notificationMenuClick = true
    this.topbarNotificationMenuActive = !this.topbarNotificationMenuActive

    this.hideOverlayMenu()

    event.preventDefault()
  }

  onMenuSignOut(event) {
    this.signOutMenuClick = true
    this.signOutMenuActive = !this.signOutMenuActive

    this.hideOverlayMenu()

    event.preventDefault()
  }

  onRightMenuClick(event) {
    this.rightMenuClick = true
    this.rightMenuActive = !this.rightMenuActive

    this.hideOverlayMenu()

    event.preventDefault()
  }

  onRippleChange(event) {
    this.app.ripple = event.checked
    this.primengConfig = event.checked
  }

  onConfigClick(event) {
    this.configClick = true
  }

  isSlim() {
    return this.app.menuMode === 'slim'
  }

  isHorizontal() {
    return this.app.menuMode === 'horizontal'
  }

  isOverlay() {
    return this.app.menuMode === 'overlay'
  }

  isDesktop() {
    return window.innerWidth > 720
  }

  isMobile() {
    return window.innerWidth <= 720
  }

  hideOverlayMenu() {
    this.overlayMenuActive = false
    this.staticMenuMobileActive = false
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll')
    } else {
      document.body.className += ' blocked-scroll'
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll')
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      )
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
