import { Component, OnInit, Inject } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product-dialog',
  templateUrl: './delete-product-dialog.component.html',
  styleUrls: ['./delete-product-dialog.component.css']
})
export class DeleteProductDialogComponent implements OnInit {

  constructor(private productService: ProductService,
     public dialogRef: MatDialogRef<DeleteProductDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  confirmDelete(){
    this.productService.delete(this.data.id).subscribe(() => {
      this.dialogRef.close(this.data.id);
    });
  }
}
