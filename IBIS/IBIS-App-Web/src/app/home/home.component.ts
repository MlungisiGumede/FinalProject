import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../Services/product.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
data: any;
inID: any;
  




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private prod: ProductService) { }

  ngOnInit() {
    this.getInventory();
  }

  getInventory(){
    this.prod.getProductList().subscribe(response => {
      console.log(response);
      this.data = response;
      //console.log(this.data[0].inventory_ID);
      
      this.inID = this.data[0].inventory_ID;
    
console.log('the name',JSON.stringify(this.data[0].product_Name));


      //let inventory = JSON.stringify(response.inventory_ID);
      
     // console.log('this is:',JSON.stringify(response['inventory_ID']))
    // console.log('finally',response);
     
    })
    

  }

  chartOptions = {
	  title: {
		  text: "Monthly Product Supply"
	  },
	  theme: "light2",
	  animationEnabled: true,
	  exportEnabled: true,
	  axisY: {
		includeZero: true,
		valueFormatString: "R#,##0k"
	  },
	  data: [{
		type: "column", //change type to bar, line, area, pie, etc
		yValueFormatString: "$#,##0K",
		color: "#01b8aa",
		dataPoints: [
			{ label: "Jan", y: 72 },
			{ label: "Feb", y: 89 },
			{ label: "Mar", y: 31 },
			{ label: "Apr", y: 40 },
			{ label: "May", y: 66 },
			{ label: "Jun", y: 96 },
			{ label: "Jul", y: 18 },
			{ label: "Aug", y: 67 },
			{ label: "Sep", y: 75 },
			{ label: "Oct", y: 52 },
			{ label: "Nov", y: 56 },
			{ label: "Dec", y: 64 }
		]
	  }]
	}


  chartOptions1 = {
	  animationEnabled: true,
	  theme: "dark2",
	  exportEnabled: true,
	  title: {
		text: "Weekly Orders"
	  },
	  subtitles: [{
		text: "Median hours/week"
	  }],
	  data: [{
		type: "pie", //change type to column, line, area, doughnut, etc
		indexLabel: "{name}: {y}%",
		dataPoints: [
			{ name: "Steak", y: 9.1 },
			{ name: "Boere wors", y: 3.7 },
			{ name: "Bacon", y: 36.4 },
			{ name: "Panchetta", y: 30.7 },
			{ name: "Ham", y: 20.1 }
		]
	  }]
	}




  timeout:any = null;
  chart: any;
 
  chartOptions2 = {
    title: {
      text: "Supplier Inventory Orders",
      fontFamily: "Trebuchet MS, Helvetica, sans-serif"
    },
    axisY: {
      title: "inventory Orders",
      includeZero: true,
      suffix: "units"
    },
    data: [{
      type: "column",	
      yValueFormatString: "#,### ",
      indexLabel: "{y}",
      dataPoints: [
        { label: "Cold Meat co", y: 206 },
        { label: "Pork Lovers", y: 163 },
        { label: "Simon and reggie", y: 154 },
        { label: "wilders", y: 176 },
        { label: "siemens", y: 184 },
        { label: "Henny", y: 122 }
      ]
    }]
  }
 
  getChartInstance(chart: object) {
    this.chart = chart;
    this.updateChart();
  }
 
  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
 
  updateChart = () => {
    let boilerColor, deltaY, yVal;
    let dps = this.chart.options.data[0].dataPoints;
    for (let i = 0; i < dps.length; i++) {
      deltaY = Math.round(2 + Math.random() *(-2-2));
      yVal = deltaY + dps[i].y > 0 ? dps[i].y + deltaY : 0;
      boilerColor = yVal > 200 ? "#C62828" : yVal >= 170 ? "#FF6F00" : yVal < 170 ? "#1B5E20 " : null;
      dps[i] = {label: "supplier"+(i+1) , y: yVal, color: boilerColor};
    }
    this.chart.options.data[0].dataPoints = dps; 
    this.chart.render();
    this.timeout = setTimeout(this.updateChart, 1000);
  };






}
