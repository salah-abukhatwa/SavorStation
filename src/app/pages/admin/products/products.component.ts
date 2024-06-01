import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { FirestoreModule } from '@angular/fire/firestore';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule , FirestoreModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  isSidePanelVisible: boolean = false;
  
  productObj: any = {
    "productId": 0,
    "productSku": '',
    "productName": '',
    "productPrice": 0,
    "productShortName": '',
    "productDescription": '',
    "createdDate": new Date(),
    "deliveryTimeSpan": '',
    "categoryId": 0,
    "productImageUrl": '',
     
  };

  categoryList: any[] = [];
  productList: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllCategory();
    this.getProducts();
    
  }
  getAllCategory() {
    this.productService.getCategory().subscribe((res: any) => {
      this.categoryList = res;
      console.log(this.categoryList)
     
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.productList = res;
    });
  }


  openSidePanale() {
    this.isSidePanelVisible = true;
  }
  closeSidePanale() {
    this.isSidePanelVisible = false;
  }

  onUpdatae(){
    this.productService.updateProduct(this.productObj).subscribe((res: any) => {
      
      if (res.result) {
        alert('Product Updated');
        this.getProducts();
      } else {
        alert(res.message);
      }
    });
  }

  onSave() {
    this.productService.saveProduct(this.productObj).subscribe((res: any) => {
      
      if (res.result) {
        alert('Product created');
        this.getProducts();
        this.closeSidePanale();
      } else {
        alert(res.message);
      }
    });
    
  }

  onEdit(item:any){
    this.productObj = item;
    this.openSidePanale();
  }
  onDelete(item:any){
    const isDelete = confirm('Are you sure want to delete')
    if (isDelete) {
      
      this.productService.deleteProduct(item.productId).subscribe((res: any) => {
        
        
        if (res.result) {
          alert('Product deleted');
          this.getProducts();
        } else {
          alert(res.message);
        }
      });
   
  }

}}
