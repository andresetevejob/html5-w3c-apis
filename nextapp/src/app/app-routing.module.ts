import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"category",component:ProductCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
