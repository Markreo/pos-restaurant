export class OrderItem {
  id;
  is_voucher;
  variant: {
    id; name; other_name
  };
  quantity;
  waiting_qty;
  price;
  grand_total;
}
