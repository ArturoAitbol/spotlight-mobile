import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { FakeChartImageService } from '../services/fakeChartImage.service';

import { DashboardPage } from './dashboard.page';
import { ImageCardComponent } from './image-card/image-card.component';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage,ImageCardComponent ],
      imports: [IonicModule.forRoot()],
      providers: [{
        provide: FakeChartImageService,
        useValue:{
          getChartImage:(parameter:any)=>{return of({url:'some url'})}
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display essential UI and components', () => {
    fixture.detectChanges();
    const serviceDescription: HTMLElement = fixture.nativeElement.querySelector('#service-description');
    const chartsTitle: HTMLElement = fixture.nativeElement.querySelector('.charts-title');
    const timelapse: HTMLElement = fixture.nativeElement.querySelector('#timelapse');
    const lastDate: HTMLElement = fixture.nativeElement.querySelector('#last-date');

    expect(serviceDescription.childElementCount).toBe(3);
    expect(serviceDescription.firstChild.textContent).toBe(component.serviceName);
    expect(serviceDescription.lastChild.textContent).toBe(component.appName);

    expect(chartsTitle.firstChild.textContent).toBe('You are a');
    expect(chartsTitle.lastChild.textContent).toBe(component.chartsHeader);

    expect(timelapse.textContent).toBe('Last '+ component.timelapse);

    const datePipe = new DatePipe('en-US');
    expect(lastDate.textContent).toBe('Since '+ datePipe.transform(component.date,'mediumDate'));
  });

  it('should refresh the chart images when calling handleRefresh()',()=>{

  })


  it('should return "Five-9" as charts header if metrics match the corresponding conditions when calling getChartsHeader()', () => {
    //current condition: both metrics beyond 90
    const chartsHeader = component.getChartsHeader(91,91);
    expect(chartsHeader).toBe('Five-9');
  });

  it('should return "Four-9" as charts header if metrics match the corresponding conditions when calling getChartsHeader()', () => {
    //current condition: both metrics above 80 and at least one of them between 81 and 85
    let chartsHeader = component.getChartsHeader(82,86);
    expect(chartsHeader).toBe('Four-9');

    chartsHeader = component.getChartsHeader(86,82);
    expect(chartsHeader).toBe('Four-9');
  });

  it('should return "Three-9" as charts header if metrics match the corresponding conditions when calling getChartsHeader()', () => {
    //current condition: both metrics above 50 and at least one of them between 51 and 70
    let chartsHeader = component.getChartsHeader(51,72);
    expect(chartsHeader).toBe('Three-9');

    chartsHeader = component.getChartsHeader(72,51);
    expect(chartsHeader).toBe('Three-9');
  });

  it('should return an empty string as charts header if metrics does not match any condition  when calling getChartsHeader()', () => {
    const chartsHeader = component.getChartsHeader(0,0);
    expect(chartsHeader).toBe('');
  });

});
