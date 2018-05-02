import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthProvider } from '../auth/auth';
import { MediaType } from '../ani-search/ani-search';
import { Observable } from 'rxjs/Observable';


export interface MediaData {
  id: string,
  title: string,
  source: string,
  coverImage: {
    medium: string,
    large: string
  },
  comments: string,
  rating: number;
  watchDate: Date,
  type: string
}

export enum FsReturnCodes {
  DUPLICATE,
  ERROR,
  SUCCESS,
  NO_DUPLI_CHECK
}

@Injectable()
export class FirestoreProvider {

  mediaCollection: any = this.firestore.firestore
    .collection('users').doc(this.authP.getCurrentUser().uid.toString())
    .collection('media');

  constructor(public http: HttpClient, public firestore: AngularFirestore,
    public authP: AuthProvider) { }

  addMedia(data: MediaData): any {
    return new Promise((resolve, reject) => {
      // query to see if duplicate exists
     this.firestore.firestore.collection('users')
        .doc(this.authP.getCurrentUser().uid.toString())
        .collection('media').where('title', '==', data.title).get()
        .then((res) => {
          if (res.size > 0) {
            // duplicate exists
            reject(FsReturnCodes.DUPLICATE);
          } else {
            // add to database
            this.addToDatabase(data).then((data) => {
              // added media successfully
              resolve(FsReturnCodes.SUCCESS);
            }).catch((err) => {
              // could not add media
              reject(FsReturnCodes.ERROR);
            });
          }
        }).catch((err) => {
          // could not query, add anyways
          this.addToDatabase(data).then((data) => {
            // added media successfully, no duplicate check
            resolve(FsReturnCodes.NO_DUPLI_CHECK);
          }).catch((err) => {
            // could not add media
            reject(FsReturnCodes.ERROR);
          });
        });
    });
  }

  /* Add given data to the database as a show, anime, movie, etc. */
  private addToDatabase(data: MediaData): Promise<any> {
    return this.firestore.collection('users')
      .doc(this.authP.getCurrentUser().uid.toString()).collection('media')
      .add(data);
  }

  /* Get all items in list of given type. If a live updated list is requierd,
  use subscribeAll() instead. */
  getAll(type: MediaType): Promise<[MediaData]> {
    return new Promise((resolve, reject) => {
      this.mediaCollection.where('type', '==', MediaType[type]).get()
        .then((res) => {
          let arr = [] as [MediaData]; // array to return containing results
          res.forEach((data) => {
            arr.push(data.data());
          });
          resolve(arr); // send back the list
        }).catch((err) => {
          // could not query
          reject(FsReturnCodes.ERROR);
        })
    });
  }

  /* Subscribe live to a list for displaying in real time */
  subscribeAll(type: MediaType): Observable<[MediaData]> {
    return new Observable(observer => {
      this.mediaCollection.where('type', '==', MediaType[type])
        .onSnapshot((snapshot) => {
          var items = [] as [MediaData];
          snapshot.forEach(element => {
            items.push(element.data());
          });
          observer.next(items);
        });
      // observer does not end until app close.
    });
  }

}
