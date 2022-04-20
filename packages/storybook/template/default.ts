export const DEFAULT_ANGULAR_MODULE_TEMPLATE = `
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NgxMoveableModule } from "ngx-moveable";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxMoveableModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`;
