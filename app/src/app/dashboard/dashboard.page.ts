import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  serviceName:string;
  appName:string;
  graphsHeader:string;
  timelapse:string;
  date:Date;
  constructor() {}
  ngOnInit(): void {
    this.serviceName = 'SpotLight';
    this.appName = 'Microsoft Teams';
    this.graphsHeader = this.getGraphsHeader(91,91);
    this.timelapse = '24 Hours';
    this.date = new Date('9/2/2022');
  }

  getGraphsHeader(metricA:number,metricB:number):string{

    const thirdThreshold = 90;

    const secondEndRange = 85;
    const secondStartRange = 81;
    const secondThreshold = 80;

    const firstEndRange = 70;
    const firstStartRange = 51;
    const firstThreshold = 50;
  
    
    if(metricA>thirdThreshold && metricB>thirdThreshold)
      return 'Five-9';

    if(metricA>secondThreshold && metricB>secondThreshold && 
      ((metricA>=secondStartRange  && metricA<=secondEndRange) || (metricB>=secondStartRange  && metricB<=secondEndRange)))
      return 'Four-9';

      
    if(metricA>firstThreshold && metricB>firstThreshold && 
      ((metricA>=firstStartRange  && metricA<=firstEndRange) || (metricB>=firstStartRange  && metricB<=firstEndRange)))
      return 'Three-9';

    return '';
  }

}
