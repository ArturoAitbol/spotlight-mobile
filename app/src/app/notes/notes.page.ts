import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { HistoricalDashboardPage } from '../dashboard/historical-dashboard/historical-dashboard.page';
import { Note } from '../model/note.model';
import { DashboardService } from '../services/dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';
import { AddNoteComponent } from './add-note/add-note.component';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  notes: Note[] = [];
  subaccountId:string = null;
  isNoteDataLoading: boolean = true;
  currentReport:string;

  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private ionToastService: IonToastService,
              private subaccountService: SubaccountService,
              private dashboardService: DashboardService,
              private noteService: NoteService) { }

  ngOnInit() {
    this.subaccountId = this.subaccountService.getSubAccount().id;
    this.currentReport = JSON.stringify(this.dashboardService.getReports());
    this.fetchNotes();
  }

  async openAddNoteModal(){
    const modal = await this.modalCtrl.create({
      component: AddNoteComponent,
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75],
      handleBehavior:"cycle"
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm')
      this.fetchNotes();
  }

  async deleteNote(id:string){
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
      this.noteService.deleteNote(id).subscribe((res)=>{
        this.ionToastService.presentToast('Note deleted successfully!');
        this.fetchNotes();
      },(err)=>{
        console.error(err);
        this.ionToastService.presentToast("Error deleting a note","Error");
      })
    }
  }

  handleRefresh(event) {
    this.fetchNotes(event);
  };

  fetchNotes(event?:any){
    this.isNoteDataLoading = true;
    this.notes = [];
    this.noteService.getNoteList(this.subaccountId,'Open').subscribe((res:any)=>{
      if(res!=null && res.notes.length>0){
        this.notes = res.notes;
        this.tagNotes(this.notes);
      }
      this.isNoteDataLoading=false;
      if(event) event.target.complete();
    },(err)=>{
      console.error(err);
      this.isNoteDataLoading=false;
      if(event) event.target.complete();
    });
  }

  tagNotes(notes){
    notes.forEach(note => {
      note.current = JSON.stringify(note.reports)===this.currentReport;
    });
  }

  async seeHistoricalReports(note){
    if(!note.current){
      const modal = await this.modalCtrl.create({
        component: HistoricalDashboardPage,
        componentProps:{note:note},
        initialBreakpoint:1,
        breakpoints:[0,1],
        handleBehavior:"cycle"
      });
      modal.present();
  
      const {data,role} = await modal.onWillDismiss();
    }
  }

}
