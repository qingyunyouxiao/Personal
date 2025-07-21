import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BackendContent} from './backend-content';

@Component({
  selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']

})
export class AppComponent {
    title:string  = 'frontend';
    response: any;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get<BackendContent>('http://localhost:8080/greeting').subscribe(
            data => {
            this.response = data;
            }
        );
    }
}
