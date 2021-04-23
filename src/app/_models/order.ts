import {OrderItem} from './order-item';
import {Table} from './table';

export class Order {
  id;
  items: OrderItem[];
  guest;
  type: string;
  description: string;
  table_map: Table;

  constructor(entity: Partial<Order> = {}) {
    this.id = entity.id;
    this.type = entity.type || 'FB';
    this.items = entity.items || [];
    this.guest = entity.guest;
    this.description = entity.description;
    this.table_map = entity.table_map;
  }
}
