import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})

export class ProductReportComponent implements OnInit {

  chart: any = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const itemNames: string[] = JSON.parse(params['itemNames'] || '[]');
      const itemQuantities: number[] = JSON.parse(params['itemQuantities'] || '[]');

      this.createBarChart(itemNames, itemQuantities);
    });
  }

  createBarChart(labels: string[], data: number[]){
    const ctx = document.getElementById('productsChart') as HTMLCanvasElement;;
    
    this.chart = new Chart(ctx, { 
      type: 'bar',
      data: {
      labels: labels,
        datasets: [
          {
            label: 'Quantity',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
