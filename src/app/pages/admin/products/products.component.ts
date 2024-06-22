import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { FirestoreModule } from '@angular/fire/firestore';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, FirestoreModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  isSidePanelVisible: boolean = false;

  productObj: Product = {
    productId: 0,
    productSku: '',
    productName: '',
    productPrice: 0,
    productShortName: '',
    productDescription: '',
    createdDate: new Date(),
    deliveryTimeSpan: '',
    categoryName: '',
    productImageUrl: '',
  };

  categoryList: any[] = [];
  productList: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllCategory();
    this.getProducts();
  }

  getAllCategory() {
    this.productService.getCategory().subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.productList = res;
    });
  }

  openSidePanel() {
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
    this.resetForm(); // Reset form when closing the side panel
  }

  onUpdate() {
    this.productService
      .updateProduct(this.productObj)
      .then(() => {
        alert('Product Updated');
        this.getProducts();
        this.closeSidePanel();
      })
      .catch((error) => {
        console.error('Error updating product: ', error);
      });
  }

  onSave() {
    this.productService
      .addProduct(this.productObj)
      .then(() => {
        this.getProducts();
        this.closeSidePanel();
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
  }

  onEdit(item: any) {
    this.productObj = { ...item }; // Create a copy of the item to avoid reference issues
    this.openSidePanel();
  }

  onDelete(item: any) {
    const isDelete = confirm('Are you sure you want to delete this product?');
    if (isDelete) {
      this.productService
        .deleteProduct(item.productId)
        .then(() => {
          alert('Product deleted');
          this.getProducts();
        })
        .catch((error) => {
          console.error('Error deleting product: ', error);
        });
    }
  }

  resetForm() {
    this.productObj = {
      productId: 0,
      productSku: '',
      productName: '',
      productPrice: 0,
      productShortName: '',
      productDescription: '',
      createdDate: new Date(),
      deliveryTimeSpan: '',
      categoryName: '',
      productImageUrl: '',
    };
  }
}
