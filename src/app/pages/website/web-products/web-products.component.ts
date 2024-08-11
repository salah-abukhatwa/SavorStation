import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-web-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css',
})
export class WebProductsComponent {
  productList: Product[] = [];
  categoryList: Category[] = [];
  constructor(private productService: ProductService, private router: Router) {}
  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
  }

  getAllCategory() {
    this.productService.getCategory().subscribe(
      (res) => {
        this.categoryList = res;
      },
      (error) => {}
    );
  }

  getProducts(categoryId?: any) {
    this.productService.getProducts().subscribe(
      (res: Product[]) => {
        this.productList = res;
      },
      (error) => {}
    );
  }
}
