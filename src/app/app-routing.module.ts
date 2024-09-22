import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CodingTestComponent} from './coding-test/coding-test.component';
import {WelcomeComponent} from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'coding-test',
    component: CodingTestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
