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
		valueFormatString: "$#,##0k"
	  },
	  data: [{
		type: "column", //change type to bar, line, area, pie, etc
		yValueFormatString: "$#,##0k",
		color: "#01b8aa",
		dataPoints: [
			{ label: "Jan", y: 172 },
			{ label: "Feb", y: 189 },
			{ label: "Mar", y: 201 },
			{ label: "Apr", y: 240 },
			{ label: "May", y: 166 },
			{ label: "Jun", y: 196 },
			{ label: "Jul", y: 218 },
			{ label: "Aug", y: 167 },
			{ label: "Sep", y: 175 },
			{ label: "Oct", y: 152 },
			{ label: "Nov", y: 156 },
			{ label: "Dec", y: 164 }
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
      text: "Temperature of Each Boiler",
      fontFamily: "Trebuchet MS, Helvetica, sans-serif"
    },
    axisY: {
      title: "Temperature (°C)",
      includeZero: true,
      suffix: " °C"
    },
    data: [{
      type: "column",	
      yValueFormatString: "#,### °C",
      indexLabel: "{y}",
      dataPoints: [
        { label: "boiler1", y: 206 },
        { label: "boiler2", y: 163 },
        { label: "boiler3", y: 154 },
        { label: "boiler4", y: 176 },
        { label: "boiler5", y: 184 },
        { label: "boiler6", y: 122 }
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
      dps[i] = {label: "Boiler "+(i+1) , y: yVal, color: boilerColor};
    }
    this.chart.options.data[0].dataPoints = dps; 
    this.chart.render();
    this.timeout = setTimeout(this.updateChart, 1000);
  };






}
