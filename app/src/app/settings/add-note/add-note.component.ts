import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { ModalController } from '@ionic/angular';
import { FakeNotesService } from 'src/app/services/fakeNotes.service';
import { IonToastService } from 'src/app/services/ionToast.service';

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

  constructor(private msalService: MsalService,
     private formBuilder: FormBuilder,
     private fakeNotesService: FakeNotesService,
     private modalCtrl: ModalController,
     private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async addNote(){
    this.loading=true;
    this.modal.canDismiss=false;
    let data = {
      message:this.noteForm.controls.message.value
    }
    this.fakeNotesService.createNote(data).subscribe(async(res)=>{
      //To-Do: Delete timeout when using the real service.
      setTimeout(()=>{ 
        this.loading=false;
        this.modal.canDismiss = true;
        this.modalCtrl.dismiss(res, 'confirm');
        this.ionToastService.presentToast("Note created successfully!");
      },1500);
    })
    
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
