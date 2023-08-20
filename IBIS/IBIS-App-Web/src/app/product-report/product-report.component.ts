import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { MatTable } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})

export class ProductReportComponent implements OnInit {

  // itemNames: string[] = []; // Define itemNames property
  // itemQuantities: number[] = []; 

  chart: any = [];
  combinedData: { Name: string, Quantity: number, Price: number}[] = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.combinedData = JSON.parse(params['combinedData'] || '[]');
      // const combinedData: { Name: string, Quantity: number }[] = JSON.parse(params['combinedData'] || '[]');
      const itemNames: string[] = this.combinedData.map(item => item.Name);
      const itemQuantities: number[] = this.combinedData.map(item => item.Quantity);
      const itemPrices: number[] = this.combinedData.map(item =>item.Price )
      console.log('yes we received the data from the product component',  itemNames, itemQuantities, itemPrices)
      
    });
  }

  

}
