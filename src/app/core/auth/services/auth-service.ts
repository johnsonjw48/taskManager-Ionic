import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserCredentials} from "../interfaces/user-credentials";
import {User} from "../interfaces/user";
import {Observable, from} from "rxjs";
import {switchMap, map} from "rxjs/operators";
import {UserToken} from "../interfaces/user-token";
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'user-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  currentUser: WritableSignal<User | null> = signal(null);

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
    this.decodeAndSetUser(token);
  }

  async getToken() {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    if (value) {
      this.decodeAndSetUser(value);
    }
    return value;
  }

  async removeToken() {
    await Preferences.remove({ key: TOKEN_KEY });
    this.currentUser.set(null);
  }

  private decodeAndSetUser(token: string) {
    try {
      const decoded: User = jwtDecode(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now())
        return this.currentUser.set(null);

      this.currentUser.set(decoded);
    } catch (e) {
      console.error('Erreur décodage token', e);
      this.currentUser.set(null);
    }
  }
}
