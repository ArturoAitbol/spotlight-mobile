import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage ],
      imports: [IonicModule.forRoot()]
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
    const graphsTitle: HTMLElement = fixture.nativeElement.querySelector('.graphs-title');
    const timelapse: HTMLElement = fixture.nativeElement.querySelector('#timelapse');
    const lastDate: HTMLElement = fixture.nativeElement.querySelector('#last-date');

    expect(serviceDescription.childElementCount).toBe(3);
    expect(serviceDescription.firstChild.textContent).toBe(component.serviceName);
    expect(serviceDescription.lastChild.textContent).toBe(component.appName);

    expect(graphsTitle.firstChild.textContent).toBe('You are a');
    expect(graphsTitle.lastChild.textContent).toBe(component.graphsHeader);

    expect(timelapse.textContent).toBe('Last '+ component.timelapse);

    const datePipe = new DatePipe('en-US');
    expect(lastDate.textContent).toBe('Since '+ datePipe.transform(component.date,'mediumDate'));
});


  it('should return "Five-9" as graphs header if metrics match the corresponding conditions when calling getGraphsHeader()', () => {
    //current condition: both metrics beyond 90
    const graphsHeader = component.getGraphsHeader(91,91);
    expect(graphsHeader).toBe('Five-9');
  });

  it('should return "Four-9" as graphs header if metrics match the corresponding conditions when calling getGraphsHeader()', () => {
    //current condition: both metrics above 80 and at least one of them between 81 and 85
    let graphsHeader = component.getGraphsHeader(82,86);
    expect(graphsHeader).toBe('Four-9');

    graphsHeader = component.getGraphsHeader(86,82);
    expect(graphsHeader).toBe('Four-9');
  });

  it('should return "Three-9" as graphs header if metrics match the corresponding conditions when calling getGraphsHeader()', () => {
    //current condition: both metrics above 50 and at least one of them between 51 and 70
    let graphsHeader = component.getGraphsHeader(51,72);
    expect(graphsHeader).toBe('Three-9');

    graphsHeader = component.getGraphsHeader(72,51);
    expect(graphsHeader).toBe('Three-9');
  });

  it('should return an empty string as graphs header if metrics does not match any condition  when calling getGraphsHeader()', () => {
    const graphsHeader = component.getGraphsHeader(0,0);
    expect(graphsHeader).toBe('');
  });

});
