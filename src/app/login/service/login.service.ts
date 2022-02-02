import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

interface IResLogin {
  token: string
  userAD: string
  userLis: string
  email: string
  roleid: string
  success: boolean
}

interface IReqLogin {
  username: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  signIn(body: IReqLogin): Observable<IResLogin> {
    // '/api/Auth/Login'
    return new Observable(subscriber => {
      subscriber.next({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IndhbmNoYWkiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwianRpIjoiNjRjMzExMTktYzg3Mi00YjUzLThlOWEtYmVlMmYwNDJmMGFlIiwibmJmIjoxNjQzNzgzNzE2LCJleHAiOjE2NDM4MDUzMTYsImlhdCI6MTY0Mzc4MzcxNn0.PkQOKFOCdw0XaVACTPu7YJrhqkq08rfrWKMRWQ3tKps',
        userAD: 'Wanchai',
        userLis: 'ATWANCHP',
        email: 'Wanchai.P@philliplife.com',
        roleid: 'AT',
        success: true
      });
      subscriber.complete();
    });
  }
}
