import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnInit {
  constructor(private http: HttpClient, private firestore: Firestore) {}

  ngOnInit(): void {}

  category = collectionData(
    collection(this.firestore, 'category')
  ) as Observable<Category[]>;

  products = collectionData(
    collection(this.firestore, 'product')
  ) as Observable<Product[]>;

  getCategory() {
    return this.category;
  }

  getProducts() {
    return this.products;
  }

  addProduct(product: any) {
    const productsCollection = collection(this.firestore, 'product');
    const newDocRef = doc(productsCollection); // Generate a new document reference with an auto-generated ID
    product.productId = newDocRef.id; // Set the productId to the generated document ID
    return setDoc(newDocRef, product); // Add the product with the set document ID
  }

  updateProduct(product: any) {
    const productDocRef = doc(this.firestore, `product/${product.productId}`);
    return updateDoc(productDocRef, product);
  }

  deleteProduct(productId: string) {
    const productDocRef = doc(this.firestore, `product/${productId}`);
    return deleteDoc(productDocRef);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    const productRef = collection(this.firestore, 'product');
    const q = query(productRef, where('categoryId', '==', categoryId));
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const data = doc.data() as Product;
          return { ...data, productId: doc.id };
        })
      )
    );
  }
}
