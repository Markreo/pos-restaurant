import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../_models/product';
import {ProductService} from '../../../_services/product.service';
import {Variant} from '../../../_models/variant';
import {OrderService} from '../../../_services/order.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Input() size = {
    itemWidth: 250,
    itemHeight: 250
  };

  loading = false;
  variant: Variant;

  constructor(private productService: ProductService, private orderService: OrderService, private translate: TranslateService) {
  }

  ngOnInit() {
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  onClickProduct() {
    if (this.variant) {
      this.orderService.triggerAddVariant(this.variant);
    } else {
      if (!this.loading) {
        this.loading = true;
        this.productService.getVariants(this.product.id).subscribe(variants => {
          this.loading = false;
          if (variants) {
            this.variant = variants[0];
            this.orderService.triggerAddVariant(variants[0]);
          }
        }, error => {
          this.loading = false;
        });
      }
    }
  }

}
