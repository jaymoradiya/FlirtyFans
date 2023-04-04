import { User } from './user.model';

export class UserParams {
  minAge = 18;
  maxAge = 99;
  gender: string;
  pageNumber = 1;
  pageSize = 4;
  orderBy = 'created';

  constructor(user: User) {
    this.gender = user.gender === 'male' ? 'female' : 'male';
  }
}
