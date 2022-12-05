import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { Note } from 'src/app/model/note.model';
import { SubAccount } from 'src/app/model/subaccount.model';
import { CtaasDashboardService } from 'src/app/services/ctaas-dashboard.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { SubaccountService } from 'src/app/services/subaccount.service';

@Component({
  selector: 'app-historical-dashboard',
  templateUrl: './historical-dashboard.page.html',
  styleUrls: ['./historical-dashboard.page.scss'],
})
export class HistoricalDashboardPage implements OnInit {

  note:Note;
  reports: any[] = [];
  charts:any[] = [];

  subaccount:SubAccount = null;

  isChartsDataLoading:boolean = true;

  constructor(private ctaasDashboardService: CtaasDashboardService,
              private subaccountService: SubaccountService,
              private ionToastService: IonToastService,
              private modalCtrl: ModalController) {}
  
  ngOnInit(): void {
    if(this.note?.reports!=null){
      this.reports = this.note.reports;
      this.fetchData();
    }else{
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast("No reports found","Error");
    }
  }

  fetchData(event?:any){
    this.subaccount = this.subaccountService.getSubAccount();
    if(this.subaccount){
      this.fetchCtaasDashboard(event);
    }else{
      this.ionToastService.presentToast("No subaccount found","Error");
    }
  }

  handleRefresh(event){
    this.fetchData(event);
  }

  fetchCtaasDashboard(event?: any){
    this.isChartsDataLoading = true;
    this.charts = [];

    const requests: Observable<any>[] = [];
    for(const report of this.reports){
      requests.push(this.ctaasDashboardService.getCtaasDashboardDetails(this.subaccount.id,report.reportType,report.timestampId));
    }

    forkJoin(requests).subscribe((res: [{ response?:string, error?:string }])=>{
      if(res){
        this.charts = [...res].filter((e: any) => !e.error).map((e: { response: string }) => e.response);
      }
      if(event) event.target.complete();
      this.isChartsDataLoading = false;
    },(e)=>{
      console.error('Error loading dashboard reports ', e.error);
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast('Error loading dashboard, please connect tekVizion admin', 'OK');
      if(event) event.target.complete();
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
