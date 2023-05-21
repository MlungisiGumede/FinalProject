import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

}
