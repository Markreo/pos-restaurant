import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectLocationPageRoutingModule } from './select-location-routing.module';

import { SelectLocationPage } from './select-location.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SelectLocationPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [SelectLocationPage]
})
export class SelectLocationPageModule {}
