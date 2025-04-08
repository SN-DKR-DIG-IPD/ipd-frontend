import { Injectable } from '@angular/core';
import { IRole } from '@data/model/role.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private roleSource = new BehaviorSubject<IRole | null>(null);
  currentRole = this.roleSource.asObservable();

  changeRole(role: IRole): void {
    this.roleSource.next(role);
  }
}
