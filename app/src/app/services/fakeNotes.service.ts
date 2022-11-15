import { Injectable } from "@angular/core";
import { of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FakeNotesService {
    
    message: string = "";

    constructor(){}

    public getNote(id:string){
        return of( this.message ? {
            id: id,
            reporter: "Ariel Rasguido",
            dateTime: new Date().toLocaleString(),
            message:this.message
        }: null);
    }

    public createNote(body:any){
        console.log("body to send: ",body);
        this.message = body.message;
        return of(body);
    }
}