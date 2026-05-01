import { Injectable } from '@angular/core';
import { flatMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserStateService {
    hasJoinedBuilding = false; // later this comes from backend
    user = { // later this comes from backend
        name: 'Ibrahim',
        photoUrl: 'brahimooo.jpg' 
    };
}
