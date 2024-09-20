import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MovieListPageComponent } from './movie-list-page/movie-list-page.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SvgModule } from './svg/svg.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModalComponent } from './authentication-modal/authentication-modal.component';
import { MovieModalComponent } from './movie-modal/movie-modal.component';
import { RegistrationModalComponent } from './registration-modal/registration-modal.component';
import { ErrorInterceptor } from './error.interceptor';
import { StoreModule } from '@ngrx/store';
import { ErrorComponent } from './error/error.component';
import { errorReducer } from './error/error.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MovieListPageComponent,
    MovieListComponent,
    AuthenticationModalComponent,
    MovieModalComponent,
    RegistrationModalComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SvgModule,
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ errors: errorReducer }, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
