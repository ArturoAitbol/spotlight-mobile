import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss']
})
export class LoadingPage implements OnInit {
  loading_status = false;
  constructor() { }

  ngOnInit() {

    let i = 1;
    function myLoop() {
      if (i < 51) {
        setTimeout(function () {
          $('#counter_percent').html(i);
          i++;
          if (i < 101) {
            myLoop();
          }
        }, 30)
      } if (i > 50) {
        setTimeout(function () {
          $('#counter_percent').html(i);
          i++;
          if (i < 101) {
            myLoop();
          }
        }, 60)
      }

    }
    myLoop();

    setTimeout(() => {
      this.loading_status = true;
    }, 4500);

    $('#content').removeClass('fullwidth').delay(9).queue(function (next) {
      $(this).addClass('fullwidth');
      next();
    });

  }
}
