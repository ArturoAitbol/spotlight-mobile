import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Note } from '../model/note.model';
import { FakeChartImageService } from '../services/fakeChartImage.service';
import { IonToastService } from '../services/ionToast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';

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
  notes: Note[] = [];
  latestNote:Note;
  previousNotes:number;
  subaccountId:string;
  noteDataIsLoading: boolean = false;
  constructor(private fakeChartImageService: FakeChartImageService,
    private noteService: NoteService,
    private subaccountService: SubaccountService,
    private ionToastService: IonToastService,
    private actionSheetCtrl: ActionSheetController) {}
  
  ngOnInit(): void {
    this.serviceName = 'SpotLight';
    this.appName = 'Microsoft Teams';
    this.chartsHeader = this.getChartsHeader(91,91);
    this.getData();
  }

  getData(){
    this.subaccountService.getSubAccountList().subscribe((res)=>{
      if(res.subaccounts.length>0){
        this.subaccountService.setSubAccount(res.subaccounts[0]);
        this.subaccountId = this.subaccountService.getSubAccount().id;
        this.getCharts();
        this.getLatestNote();
      }
    });
  }

  handleRefresh(event) {
    this.getCharts(event);
    this.getLatestNote();
   };

  getLatestNote(){
    this.notes = [];
    this.noteDataIsLoading=true;
    this.noteService.getNoteList(this.subaccountId,'Open').subscribe((res:any)=>{
      this.noteDataIsLoading=false;
      if(res!=null && res.notes.length>0){
        this.notes = res.notes;
        this.previousNotes = this.notes.length-1;
        this.latestNote = this.notes[0];
      }
    });
  }

   async deleteNote(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if(role === 'destructive'){
      this.noteService.deleteNote(this.latestNote.id).subscribe((res)=>{
        this.ionToastService.presentToast('Subaccount deleted successfully!');
        this.getLatestNote();
      },(err)=>{
        console.log(err);
        this.ionToastService.presentToast("Error deleting a note");
      })
    }
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
      this.timelapse = '24 Hours';
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
