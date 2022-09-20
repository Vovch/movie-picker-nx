import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {MoviesService} from '../movies.service';

@Component({
  selector: 'movie-picker-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  login: string | null = this.auth.getAuthInfo().login;
  isLoginModalOpen = false;
  isRegistrationModalOpen = false;

  constructor(private auth: AuthenticationService, private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.login = this.auth.getAuthInfo().login;
      }
    });
  }

  handleLoginClick() {
    this.isLoginModalOpen = true;
  }

  handleRegisterClick() {
    this.isRegistrationModalOpen = true;
  }

  handleHideLoginModal() {
    this.isLoginModalOpen = false;
  }

  handleHideRegistrationModal() {
    this.isRegistrationModalOpen = false;
  }

  handleLogOutClick() {
    this.auth.logOut();
    this.moviesService.changeUserLists([])
  }
}
