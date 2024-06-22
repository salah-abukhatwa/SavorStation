import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  products$: Observable<any> | undefined;
  constructor(private productSer: ProductService) {
    this.products$ = this.productSer.getCategory();
  }

  getAllCategory() {}
}
