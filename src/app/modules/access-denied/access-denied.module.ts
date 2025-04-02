import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import {LucideAngularModule} from "lucide-angular";
import {AccessDeniedRoutingModule} from "./access-denied-routing.module";
import {AccessDeniedComponent} from "./access-denied.component";

@NgModule({
    imports: [
        SharedModule,
        AccessDeniedRoutingModule,
        LucideAngularModule
    ],
  declarations: [AccessDeniedComponent],
})
export class AccessDeniedModule { }
