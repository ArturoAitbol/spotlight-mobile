import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FakeChartImageService } from '../services/fakeChartImage.service';
import { FakeNotesService } from '../services/fakeNotes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  serviceName:string;
  appName:string;
  chartsHeader:string;
  timelapse:string;
  date:Date;
  firstChart:string;
  secondChart:string;
  latestNote:any;
  constructor(private fakeChartImageService: FakeChartImageService,private fakeNotesService: FakeNotesService) {}
  ngOnInit(): void {
    this.serviceName = 'SpotLight';
    this.appName = 'Microsoft Teams';
    this.chartsHeader = this.getChartsHeader(91,91);
    this.getCharts();
    this.getLatestNote();
  }

  handleRefresh(event) {
    this.getCharts(event);
    this.getLatestNote();
   };

   getLatestNote(){
    this.fakeNotesService.getNote("abc123").subscribe(res=>{
      console.log(res);
      if(res!=null){
        this.latestNote = res;
        this.latestNote.dateTime = new Date(this.latestNote.dateTime);
      }
    });
   }

  getCharts(event?: any){
    this.firstChart = null;
    this.secondChart = null;
    this.timelapse = null;
    this.date = null;
    forkJoin([
      this.fakeChartImageService.getChartImage('first'),
      this.fakeChartImageService.getChartImage('second')
    ]).subscribe((res:any[]) =>{
      this.firstChart = res[0].url;
      this.secondChart = res[1].url;
      this.timelapse = '24 Hours'
      this.date = new Date('9/2/2022');
      if(event)
        event.target.complete();
    })
  }

  getChartsHeader(metricA:number,metricB:number):string{

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
