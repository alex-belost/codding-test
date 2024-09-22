import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RadioButtonComponent} from './shared/radio-button/radio-button.component';
import {SwitchButtonComponent} from './shared/switch-button/switch-button.component';
import {FakeHttpClientService} from './services/fake-http-client.service';
import {SpinnerComponent} from './shared/spinner/spinner.component';
import {StatusChangeBadgeComponent} from './shared/status-change-badge/status-change-badge.component';
import {CodingTestComponent} from './coding-test/coding-test.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {KeywordsDataComponent} from './coding-test/keywords-form/keywords-form.component';
import { ToastComponent } from './shared/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    KeywordsDataComponent,
    RadioButtonComponent,
    SwitchButtonComponent,
    SpinnerComponent,
    StatusChangeBadgeComponent,
    CodingTestComponent,
    WelcomeComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HttpClient,
      useClass: FakeHttpClientService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
