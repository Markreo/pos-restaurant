export class OrderItem {
  id;
  is_voucher;
  variant: {
    id; name; other_name
  };
  quantity;
  waiting_qty;
  cooking_qty;
  price;
  grand_total;

  constructor(entity: Partial<OrderItem> = {}) {
    this.id = entity.id;
    this.is_voucher = entity.is_voucher;
    this.variant = entity.variant;
    this.quantity = entity.quantity;
    this.waiting_qty = entity.waiting_qty;
    this.cooking_qty = entity.cooking_qty;
    this.price = entity.price;
    this.grand_total = entity.grand_total;
  }
}
