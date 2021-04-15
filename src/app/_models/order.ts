import {OrderItem} from './order-item';

export class Order {
  id;
  items: OrderItem[];
  guest;

  constructor(entity: Partial<Order> = {}) {
    this.id = entity.id;
    this.items = entity.items || [];
    this.guest = entity.guest;
  }
}
