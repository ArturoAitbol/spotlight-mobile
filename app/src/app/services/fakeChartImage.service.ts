import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class FakeChartImageService {

    private readonly API_URL_GRAPH: string = 'https://quickchart.io/chart/create';

    constructor(private httpClient: HttpClient){}

    public getChartImage(chart:string){
        let chartInfo: any;
        if(chart==='first'){
            chartInfo = { 
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [{
                    data: [94, 25, 72, 70, 14],
                    backgroundColor: ['rgb(255, 99, 132)',
                                      'rgb(255, 159, 64)',
                                      'rgb(255, 205, 86)',
                                      'rgb(75, 192, 192)',
                                      'rgb(54, 162, 235)',],
                    label: 'Dataset 1',
                    }]
                }
        }else{
            chartInfo = {labels: ['Green', 'Blue'],
                        datasets: [{
                            data: [94, 25],
                            backgroundColor: ['rgb(75, 192, 192)','rgb(54, 162, 235)'],
                            label: 'Dataset 2',
                            }]
                        }
        }
        const body = {'chart': {
            type: 'doughnut',
            data: chartInfo,
            options: {
            title: {
                display: false,
                text: 'Chart.js Doughnut Chart',
            },
            },
        }};
        return this.httpClient.post(this.API_URL_GRAPH,body);
    }
}