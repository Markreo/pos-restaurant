import {Variant} from './variant';

export class Product {
  id;
  name;
  other_name;
  image;
  price;
  sale_price;
  formatted_sale_price;
  variants: Variant[] = [];
}
