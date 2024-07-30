import {Component, OnInit} from '@angular/core';
import {HTTPService} from './http.service';
import {MoviesService} from './movies.service';
import {AuthenticationService} from './authentication.service';

@Component({
    selector: 'movie-picker-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    constructor(private http: HTTPService, private moviesService: MoviesService, private auth: AuthenticationService) {}

    ngOnInit() {
        const {login, hash} = this.auth.getAuthInfo();

        if (login && hash) {
          this.moviesService.fetchUserLists(login, hash);
        }

        this.http.getLists().subscribe(this.moviesService.changeLists);
        this.moviesService.selectList();
    }
}
