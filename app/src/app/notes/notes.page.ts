import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { HistoricalDashboardPage } from '../dashboard/historical-dashboard/historical-dashboard.page';
import { Note } from '../model/note.model';
import { DashboardService } from '../services/dashboard.service';
import { IonToastService } from '../services/ion-toast.service';
import { NoteService } from '../services/note.service';
import { SubaccountService } from '../services/subaccount.service';
import { AddNoteComponent } from './add-note/add-note.component';
import { isEqual } from 'lodash-es';
import { Router } from '@angular/router';
import { DataRefresherService } from '../services/data-refresher.service';
import { Subscription } from 'rxjs';
import { PushNotificationsService } from '../services/push-notifications.service';
import { CtaasSetupService } from '../services/ctaasSetup.service';
import { ISetup } from '../model/setup.model';
import { Constants } from '../helpers/constants';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit, OnDestroy {

  notes: Note[] = [];
  subaccountId: string = null;
  isNoteDataLoading: boolean = true;
  currentReport: string;
  foregroundSubscription: Subscription;
  dashboardSubscription: Subscription;
  pushNotificationsSubscription: Subscription;
  isiOS = false;
  ctaasSetupDetails: any = {};
  setupStatus = '';
  isOnboardingComplete: boolean;
  maintenance: boolean = false;
  maintenanceAlert = {
    title: Constants.MAINTENANCE_MODE_ALERT_TITLE,
    message: Constants.MAINTENANCE_MODE_ALERT_MESSAGE
  };

  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private ionToastService: IonToastService,
              private subaccountService: SubaccountService,
              private dashboardService: DashboardService,
              private foregroundService: DataRefresherService,
              private pushNotificationsService: PushNotificationsService,
              private noteService: NoteService,
              private router: Router,
              private ctaasSetupService: CtaasSetupService) {
                this.foregroundSubscription = this.foregroundService.backToActiveApp$.subscribe(()=>{
                  const isNotesPageOpen = this.router.url==='/tabs/notes';
                  if(isNotesPageOpen)
                    this.resetBadgeCount();
                  this.fetchNotes();
                });
                this.dashboardSubscription = this.dashboardService.dashboardRefreshed$.subscribe(()=>{
                  this.fetchNotes();
                })
                this.pushNotificationsSubscription = this.pushNotificationsService.newPushNotification$.subscribe(()=>{
                  this.fetchNotes();
                });
               }

  ngOnInit() {
    this.subaccountId = this.subaccountService.getSubAccount().id;
    this.isiOS = /iPhone/i.test(window.navigator.userAgent);
    this.resetBadgeCount();
    this.fetchNotes();
  }
  ionViewWillEnter(){
    this.resetBadgeCount();
    window.screen.orientation.lock('portrait');
    window.screen.orientation.unlock();
  }

  ngOnDestroy(): void {
    if (this.foregroundSubscription)
      this.foregroundSubscription.unsubscribe();
    if (this.dashboardSubscription)
      this.dashboardSubscription.unsubscribe();
    if (this.pushNotificationsSubscription)
      this.pushNotificationsSubscription.unsubscribe();
  }

  async openAddNoteModal(){
    const modal = await this.modalCtrl.create({
      component: AddNoteComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75],
      handleBehavior: "cycle"
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm')
      this.fetchNotes();
  }

  async closeNote(id: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to close this note?',
      buttons: [
        {
          text: 'Close',
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
      this.noteService.deleteNote(id).subscribe((res) => {
        this.ionToastService.presentToast('Note closed successfully!');
        this.fetchNotes();
      }, (err) => {
        console.error(err);
        this.ionToastService.presentToast("Error closing a note", "Error");
      })
    }
  }

  handleRefresh(event) {
    this.fetchNotes(event);
  };

  fetchNotes(event?: any) {
    this.isNoteDataLoading = true;
    this.notes = [];
    this.noteService.getNoteList(this.subaccountId, 'Open').subscribe((res: any) => {
      if (res != null && res.notes.length > 0) {
        this.notes = res.notes;
      }
      this.isNoteDataLoading = false;
      if (event)
        event.target.complete();
    }, (err) => {
      console.error(err);
      this.isNoteDataLoading = false;
      if (event)
        event.target.complete();
    });
    this.ctaasSetupService.getSubaccountCtaasSetupDetails(this.subaccountId).subscribe((response: { ctaasSetups: ISetup[] }) => {
      this.ctaasSetupDetails = response['ctaasSetups'][0];
      const { onBoardingComplete, status, maintenance } = this.ctaasSetupDetails;
      this.isOnboardingComplete = onBoardingComplete;
      this.setupStatus = status;
      this.maintenance = maintenance;
    });
  }

  async seeHistoricalReports(note) {
    const modal = await this.modalCtrl.create({
      component: HistoricalDashboardPage,
      componentProps: { note: note },
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      handleBehavior: "cycle"
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();
  }

  public async resetBadgeCount(): Promise<void> {
    await this.pushNotificationsService.resetBadgeCount();
  }
}
