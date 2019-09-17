import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxMoveableModule } from '../../projects/ngx-moveable/src/lib/ngx-moveable.module';
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
