import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiUser } from '../models/api-user.model';
import { Specialist } from '../models/specialist.model';

@Injectable({
  providedIn: 'root'
})
export class SpecialistsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl: string = 'https://jsonplaceholder.typicode.com/users';

  getSpecialists(): Observable<Specialist[]> {
    return this.http.get<ApiUser[]>(this.apiUrl).pipe(
      map(users => users.map(user => ({
        id: user.id,
        fullName: user.name,
        lastName: this.getLastName(user.name),
        email: user.email,
        phone: user.phone,
        city: user.address.city,
        company: user.company.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
      })))
    );
  }

  private getLastName(fullName: string): string {
    const words = fullName
      .split(' ')
      .filter(word => !word.endsWith('.') && !/^([IVX]+|Jr|Sr)$/.test(word));
    return words[words.length - 1] ?? fullName;
  }
}
