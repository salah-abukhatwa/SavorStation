import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { LandingComponent } from './pages/website/landing/landing.component';
import { CategoryProdComponent } from './pages/website/category-prod/category-prod.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: 'shop',
        component: WebProductsComponent,
      },
      {
        path: 'products/:id',
        component: CategoryProdComponent,
      },
    ],
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'category',
        component: CategoriesComponent,
      },
    ],
  },
];
