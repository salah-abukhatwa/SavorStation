import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Constant } from '../constant/constant';
import { Firestore, FirestoreModule, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnInit {
  constructor(private http: HttpClient , private firestore:Firestore) {}
  ngOnInit(): void {
    
  }
  category = collectionData(collection(this.firestore , 'category' ))as  Observable<any[]> 

  getCategory() {
   return this.category
  
  }
  getProducts() {
    return this.http.get(
      Constant.API_END_POINT + Constant.METHODS.GET_ALL_PRODUCT
    );
  }
  saveProduct(obj: any) {
    return this.http.post(
      Constant.API_END_POINT + Constant.METHODS.CREATE_PRODUCT,
      obj
    );
  }
  updateProduct(obj: any) {
    return this.http.post(
      Constant.API_END_POINT + Constant.METHODS.UPDATE_PRODUCT,
      obj
    );
  }
  deleteProduct(id: any) {
    return this.http.get(
      Constant.API_END_POINT + Constant.METHODS.DELETE_PRODUCT + id
    );
  }
}
