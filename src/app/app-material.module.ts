import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatInputModule, MatFormFieldModule,
  MatCheckboxModule, MatMenuModule, MatIconModule, MatSelectModule,
  MatDialogModule, MatDividerModule, MatCardModule, MatTooltipModule,
  MatProgressSpinnerModule, MatProgressBarModule
} from '@angular/material';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ]
})
export class AppMaterialModule { }
