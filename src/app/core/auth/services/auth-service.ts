import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserCredentials} from "../interfaces/user-credentials";
import {User} from "../interfaces/user";
import {Observable, from} from "rxjs";
import {switchMap, map} from "rxjs/operators";
import {UserToken} from "../interfaces/user-token";
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'user-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient)

  register (credentials: UserCredentials): Observable<User> {
      return this.http.post<User>(`${this.apiUrl}/auth/register`, credentials);
  }

  login (credentials: UserCredentials): Observable<UserToken> {
      return this.http.post<UserToken>(`${this.apiUrl}/auth/login`, credentials).pipe(
        switchMap(token => {
          return from(this.setToken(token.access_token)).pipe(
            map(() => token)
          );
        })
      );
  }

  async setToken(token: string) {
    await Preferences.set({ key: TOKEN_KEY, value: token });
  }

  async getToken() {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  }

  async removeToken() {
    await Preferences.remove({ key: TOKEN_KEY });
  }
}
