import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { ReportType } from '../helpers/report-type';
import { Note } from '../model/note.model';
import { CtaasDashboardService } from '../services/ctaas-dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  serviceName: string;
  appName: string;
  timelapse: string;

  lastUpdate: string;
  charts: any[] = [];
  notes: Note[] = [];

  latestNote: Note;
  previousNotes: number;
  subaccountId: string = null;

  isChartsDataLoading: boolean = true;
  isNoteDataLoading: boolean = true;

  constructor(private ctaasDashboardService: CtaasDashboardService,
    private noteService: NoteService,
    private subaccountService: SubaccountService,
    private ionToastService: IonToastService,
    private actionSheetCtrl: ActionSheetController) { }

  ngOnInit(): void {
    this.serviceName = 'SpotLight';
    this.appName = 'Microsoft Teams';
    this.timelapse = 'Last 24 Hours';
    this.fetchData();
  }

  fetchData(event?: any) {
    this.subaccountService.getSubAccountList().subscribe((res) => {
      if (res.subaccounts.length > 0) {
        this.subaccountService.setSubAccount(res.subaccounts[0]);
        this.subaccountId = this.subaccountService.getSubAccount().id;
        this.fetchCtaasDashboard(event);
        this.fetchNotes();
      } else {
        this.isChartsDataLoading = false;
        this.isNoteDataLoading = false;
      }
    }, (err) => {
      console.error(err);
      this.isChartsDataLoading = false;
      this.isNoteDataLoading = false;
    });
  }

  handleRefresh(event) {
    this.fetchData(event);
  };

  fetchNotes() {
    this.isNoteDataLoading = true;
    this.notes = [];
    this.latestNote = null;
    this.previousNotes = null;
    this.noteService.getNoteList(this.subaccountId, 'Open').subscribe((res: any) => {
      if (res != null && res.notes.length > 0) {
        this.notes = res.notes;
        this.previousNotes = this.notes.length - 1;
        this.latestNote = this.notes[0];
      }
      this.isNoteDataLoading = false;
    }, (err) => {
      console.error(err);
      this.isNoteDataLoading = false;
    });
  }

  async deleteNote() {

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

    if (role === 'destructive') {
      this.noteService.deleteNote(this.latestNote.id).subscribe((res) => {
        this.ionToastService.presentToast('Note deleted successfully!');
        this.fetchNotes();
      }, (err) => {
        console.error(err);
        this.ionToastService.presentToast("Error deleting a note", "Error");
      })
    }
  }

  fetchCtaasDashboard(event?: any) {
    this.isChartsDataLoading = true;
    this.charts = [];

    const requests: Observable<any>[] = [];
    for (const key in ReportType) {
      const reportType: string = ReportType[key];
      requests.push(this.ctaasDashboardService.getCtaasDashboardDetails(this.subaccountId, reportType));
    }

    forkJoin(requests).subscribe((res: [{ response?: string, error?: string }]) => {
      if (res) {
        this.charts = [...res].map((e: { response: any }) => e.response ? e.response : e);
        this.lastUpdate = this.charts[0].lastUpdatedTS ? this.charts[0].lastUpdatedTS : null;
      }
      if (event) event.target.complete();
      this.isChartsDataLoading = false;
    }, (e) => {
      console.error('Error loading dashboard reports ', e.error);
      this.isChartsDataLoading = false;
      this.ionToastService.presentToast('Error loading dashboard, please connect tekVizion admin', 'Ok');
      if (event) event.target.complete();
    })
  }

}
