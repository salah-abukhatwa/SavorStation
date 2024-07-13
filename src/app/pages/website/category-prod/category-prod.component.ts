import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-category-prod',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-prod.component.html',
  styleUrl: './category-prod.component.css',
})
export class CategoryProdComponent implements OnInit {
  activeCategoryId: number = 12;
  products: Product[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    this.activatedRoute.params.subscribe((res) => {
      this.activeCategoryId = +res['id']; // Convert to number
      this.getProducts();
    });
  }

  ngOnInit(): void {}

  getProducts() {
    this.productService
      .getProductsByCategory(this.activeCategoryId)
      .subscribe((res) => {
        this.products = res;
      });
  }
}
