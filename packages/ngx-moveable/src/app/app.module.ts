import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxMoveableModule } from '../../projects/ngx-moveable/src/ngx-moveable.module';
// import { NgxMoveableModule } from 'ngx-moveable';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxMoveableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
