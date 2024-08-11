import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Category } from '../../../models/category.model';
import { AuthService } from '../../admin/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  productList: Product[] = [];
  categoryList: Category[] = [];
  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}
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
  navigateToProd(id: number) {
    this.router.navigate(['/products', id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
