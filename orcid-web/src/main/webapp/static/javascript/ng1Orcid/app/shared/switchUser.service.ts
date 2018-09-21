import { Injectable } 
    from '@angular/core';

import { HttpClient, HttpClientModule, HttpHeaders } 
     from '@angular/common/http';

import { Observable, Subject } 
    from 'rxjs';

import { catchError, map, tap } 
    from 'rxjs/operators';

@Injectable()
export class SwitchUserService {
    private headers: HttpHeaders;
    private url: string;
    private notify = new Subject<any>();
    
    notifyObservable$ = this.notify.asObservable();

    constructor( private http: HttpClient ){
        this.headers = new HttpHeaders(
            {
                'Access-Control-Allow-Origin':'*',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector("meta[name='_csrf']").getAttribute("content")
            }
        );
    }

    getDelegates(): Observable<any> {
        return this.http.get(
            getBaseUri()+'/delegators/delegators-and-me.json'
        )
        
    }

    searchDelegates(searchTerm): Observable<any> {
        return this.http.get(
            getBaseUri()+'/delegators/search/'+encodeURIComponent(searchTerm) + '?limit=10'
        )
        
    }

    switchUser(id): Observable<any> {        
        return this.http.get( 
            getBaseUri() + '/switch-user?username=' + id
        )
    }
    
    switchUserAdmin(id): Observable<any> {
        return this.http.get(
                getBaseUri() + '/admin-actions/admin-switch-user?orcidOrEmail=' + id
        );        
    };

    notifyOther(): void {
        this.notify.next();
        console.log('notify');
    }
}