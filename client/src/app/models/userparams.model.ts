import { User } from './user.model';

export class UserParams {
  minAge = 18;
  maxAge = 100;
  gender: string;
  pageNumber = 1;
  pageSize = 4;

  constructor(user: User) {
    this.gender = user.gender === 'male' ? 'female' : 'male';
  }
}
