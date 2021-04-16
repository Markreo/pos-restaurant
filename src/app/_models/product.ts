import {Variant} from './variant';

export class Product {
  id;
  name;
  image;
  formatted_sale_price;
  variants: Variant[] = [];
}
