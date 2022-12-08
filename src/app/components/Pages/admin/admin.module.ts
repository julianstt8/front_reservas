import { Routes, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../../Guards/auth.guard';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'Landing', loadChildren: () => import('../landing/landing.module').then(m => m.LandingModule) }
];

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, RouterModule.forChild(routes)
  ]
})

export class AdminModule { }
