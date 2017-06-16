import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;


  constructor(private http: Http) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //  let ep = this.prepEndpoint('users/register');
    return this.http.post('http://localhost:3000/users/register', user, { headers: headers })
      .map(res => res.json());
  }


  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // let ep = this.prepEndpoint('users/authenticate');
    return this.http.post('http://localhost:3000/users/authenticate', user, { headers: headers })
      .map(res => res.json());
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken); //send token with request to the endpoint 
    headers.append('Content-Type', 'application/json');
    //  let ep = this.prepEndpoint('users/profile');
    return this.http.get('http://localhost:3000/users/profile', { headers: headers })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  //must use this method or else cannot authorize
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null; //empty token
    this.user = null;
    localStorage.clear();
  }


  // prepEndpoint(ep){
  //   if(this.isDev){
  //     return ep;
  //   } else {
  //     return 'http://localhost:8080/'+ep;
  //   }
  // }



}
