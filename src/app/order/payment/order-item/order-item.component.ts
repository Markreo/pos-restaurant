import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrderItem} from '../../../_models/order-item';
import {AlertController, ModalController} from '@ionic/angular';
import {OrderItemDetailComponent} from '../order-item-detail/order-item-detail.component';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input() item: OrderItem;
  @Output() itemChange = new EventEmitter<OrderItem>();
  @Output() removeItem = new EventEmitter();

  constructor(private alertController: AlertController,
              public modalController: ModalController) {
  }

  ngOnInit() {
  }

  async presentEditQty() {
    await this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Enter quantity',
      inputs: [
        {
          name: 'qty',
          type: 'number',
          placeholder: 'Enter quantity',
          min: 1,
          value: this.item.quantity
        }
      ],
      buttons: [
        {text: 'DELETE', role: 'DELETE', cssClass: 'danger'},
        {text: 'OK', role: 'Ok'}
      ]
    });
    await alert.present();
    return await alert.onDidDismiss();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: OrderItemDetailComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        item: {...this.item},
        updateItem: this.updateItem,
        removeItem: this.removeThis
      }
    });
    return await modal.present();
  }

  updateItem = (newData) => {
    this.item = newData;
    this.itemChange.emit(this.item);
  };

  removeThis = () => {
    console.log('remove this');
    this.removeItem.emit();
  };
}
