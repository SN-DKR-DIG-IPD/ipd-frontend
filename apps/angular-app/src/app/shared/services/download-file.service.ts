import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor() { }
  
//   downloadFile(id): Observable<Blob> {
//     let options = new RequestOptions({responseType: ResponseContentType.Blob });
//     return this.http.get(this._baseUrl + '/' + id, options)
//         .map(res => res.blob())
//         .catch(this.handleError)
// }
}
