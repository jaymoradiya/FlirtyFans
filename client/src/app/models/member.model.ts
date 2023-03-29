import { Photo } from './photo.model';

export interface Member {
  id: number;
  email: string;
  photoUrl: string;
  gender: string;
  knownAs: any;
  age: number;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photos: Photo[];
  lastActive: string;
  created: string;
}
