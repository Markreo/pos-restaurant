import {OrderItem} from './order-item';
import {Table} from './table';

export class Order {
  id;
  items: OrderItem[];
  guest;
  type: string;
  description: string;
  table_map: Table;
  payment_method: string;

  discount: number;
  discount_type: 'FIXED' | 'PERCENTAGE';

  constructor(entity: Partial<Order> = {}) {
    this.id = entity.id;
    this.type = entity.type || 'FB';
    this.items = entity.items || [];
    this.guest = entity.guest;
    this.description = entity.description;
    this.table_map = entity.table_map;
    this.payment_method = entity.payment_method;
    this.discount = entity.discount || 0;
    this.discount_type = entity.discount_type || 'FIXED';
  }
}
