import {Guest} from './guest';

export class OrderItem {
  id;
  is_voucher: boolean;
  variant: {
    id; name; other_name,product_id
  };
  quantity;
  waiting_qty;
  cooking_qty;
  price;
  grand_total;
  guest: Guest
  discount;
  discount_type;
  description: string

  constructor(entity: Partial<OrderItem> = {}) {
    this.id = entity.id;
    this.is_voucher = entity.is_voucher;
    this.variant = entity.variant;
    this.quantity = entity.quantity;
    this.waiting_qty = entity.waiting_qty;
    this.cooking_qty = entity.cooking_qty;
    this.price = entity.price;
    this.grand_total = entity.grand_total;
    this.guest = entity.guest;
    this.discount = entity.discount;
    this.discount_type = entity.discount_type;
    this.description = entity.description;
  }
}
