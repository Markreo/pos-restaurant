import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatCurrencyPipe} from './format-currency.pipe';

const exs = [FormatCurrencyPipe];

@NgModule({
  declarations: exs,
  imports: [
    CommonModule
  ],
  exports: exs
})
export class SharedModule {
}
