import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MoviesService} from '../movies.service';
import {AuthenticationService} from '../authentication.service';
import {EMovieStatus, IMovie} from "@movie-picker/api-interfaces";

@Component({
    selector: 'movie-picker-movie-modal',
    templateUrl: './movie-modal.component.html',
    styleUrls: ['./movie-modal.component.less'],
})
export class MovieModalComponent implements OnInit {
    @Input() isOpen!: boolean;
    @Input() movie!: IMovie;
    @Input() listId!: string;
    @Output() hideModal = new EventEmitter<void>();

    isAuthenticated = false;

    constructor(private moviesService: MoviesService, private auth: AuthenticationService) {}

    /** Normalized watch links for template (single string or multi-part list). */
    get watchUrlLinks(): string[] {
        const w = this.movie?.watchUrl;
        if (w == null) return [];
        return Array.isArray(w) ? w : [w];
    }

    ngOnInit(): void {
        this.auth.isAuthenticated$.subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
    }

    handleHideModal() {
        this.hideModal.emit();
    }

    handleToWatchedClick() {
        this.moviesService.changeMovieStatus(this.listId, this.movie.id, EMovieStatus.WATCHED);
        this.handleHideModal();
    }

    handleToPostponedClick() {
        this.moviesService.changeMovieStatus(this.listId, this.movie.id, EMovieStatus.POSTPONED);
        this.handleHideModal();
    }

    handleResetStatusClick() {
        this.moviesService.changeMovieStatus(this.listId, this.movie.id, null);
        this.handleHideModal();
    }
}
