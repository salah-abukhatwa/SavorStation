import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  productList: Product[] = [];
  categoryList: any[] = [];

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
  }

  getAllCategory() {
    this.productService.getCategory().subscribe((res: any) => {
      this.categoryList = res;
    });
  }
  getProducts() {
    this.productService.getProducts().subscribe((res: Product[]) => {
      this.productList = res;
      console.log(this.productList);
    });
  }
}
