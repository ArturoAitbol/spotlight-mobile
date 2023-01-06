import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { NoteService } from 'src/app/services/note.service';
import { SubaccountService } from 'src/app/services/subaccount.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent implements OnInit {

  loading:Boolean=false;
  modal: HTMLIonModalElement;
  
  noteForm = this.formBuilder.group({
    message: ['',Validators.required],
  })

  constructor(private formBuilder: FormBuilder,
              private noteService: NoteService,
              private subaccountService: SubaccountService,
              private dashboardService: DashboardService,
              private modalCtrl: ModalController,
              private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async addNote(){
    this.loading=true;
    this.modal = await this.modalCtrl.getTop();
    this.modal.canDismiss=false;
    const currentReports = this.dashboardService.getReports();
    let data: any = {
      subaccountId:this.subaccountService.getSubAccount().id,
      content:this.noteForm.controls.message.value,
    }
    if(currentReports!==null)
      data.reports = currentReports
    this.noteService.createNote(data).subscribe((res)=>{
      this.loading=false;
      this.modal.canDismiss = true;
      this.modalCtrl.dismiss(res, 'confirm');
      this.ionToastService.presentToast("Note created successfully!");
    },(err)=>{
      console.error(err);
      this.loading=false;
      this.modal.canDismiss = true;
      this.ionToastService.presentToast("Error creating a note. " + err.error,"Error");
    });
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
