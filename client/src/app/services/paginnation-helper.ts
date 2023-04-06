import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { PaginationResult } from '../models/pagination.model';
import { UserParams } from '../models/userparams.model';

export function getPaginationResult<T>(
  url: string,
  params: HttpParams,
  http: HttpClient
) {
  let paginationResult: PaginationResult<T> = new PaginationResult<T>();

  return http
    .get<ApiResponse<T>>(url, {
      observe: 'response',
      params: params,
    })
    .pipe(
      map((res) => {
        if (res.body) {
          paginationResult.data = res.body.data;
        }
        const pagination = res.headers.get('Pagination');
        if (pagination) {
          paginationResult.pagination = JSON.parse(pagination);
        }
        return paginationResult;
      })
    );
}

export function getPaginationParams(userParams: UserParams) {
  let params = new HttpParams();

  params = params.append('pageNumber', userParams.pageNumber);
  params = params.append('pageSize', userParams.pageSize);
  params = params.append('minAge', userParams.minAge);
  params = params.append('maxAge', userParams.maxAge);
  params = params.append('gender', userParams.gender);
  return params;
}
