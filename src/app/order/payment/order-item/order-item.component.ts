import {Component, Input, OnInit} from '@angular/core';
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
        item: {...this.item}
      }
    });
    return await modal.present();
  }


}
