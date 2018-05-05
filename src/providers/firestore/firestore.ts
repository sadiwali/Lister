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

  /* update the media */
  updateMedia(id: string, newData: any) {
    return new Promise((resolve, reject) => {
      this.firestore.firestore.collection('users')
        .doc(this.authP.getCurrentUser().uid.toString()).collection('media')
        .where('id', '==', id).get().then(res => {
          let docId = res.docs[0].id;
          this.firestore.firestore.collection('users')
            .doc(this.authP.getCurrentUser().uid.toString()).collection('media')
            .doc(docId).set(newData, { merge: true }).then(() => {
              resolve()
            }).catch(() => {
              reject();
            })
        }).catch(err => {
          console.log('dd');
          reject();
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
      this.firestore.firestore
        .collection('users').doc(this.authP.getCurrentUser().uid.toString())
        .collection('media').where('type', '==', MediaType[type]).get()
        .then((res) => {
          let arr = [] as [MediaData]; // array to return containing results
          res.forEach((data) => {
            arr.push(data.data() as MediaData);
          });
          resolve(arr); // send back the list
        }).catch((err) => {
          // could not query
          reject(FsReturnCodes.ERROR);
        })
    });
  }


  importfromfile(file) {

  }


  /* delete a record from a collection  */
  delete(id: string) {
    return new Promise((resolve, reject) => {
      this.firestore.firestore.collection('users')
        .doc(this.authP.getCurrentUser().uid.toString())
        .collection('media').where('id', '==', id).get().then(data => {
          let docId = data.docs[0].id; // there should only be one
          // delete the doc
          this.firestore.firestore.collection('users')
            .doc(this.authP.getCurrentUser().uid.toString())
            .collection('media').doc(docId).delete()
            .then(() => resolve()).catch(() => reject());
        }).catch(err => {
          console.log(err);
          reject();
        })
    });
  }

  /* Subscribe live to a list for displaying in real time */
  subscribeAll(type: MediaType = null): Observable<[MediaData]> {
    if (!type) {
      return new Observable(observer => {
        this.firestore.firestore
          .collection('users').doc(this.authP.getCurrentUser().uid.toString())
          .collection('media').onSnapshot(snapshot => {
            var items = [] as [MediaData];
            snapshot.forEach(element => {
              items.push(element.data() as MediaData);
            });
            observer.next(items);
          },
            (err) => {
              // on error, close the subscription
              observer.complete();
            });
        // observer does not end until app close.
      });
    } else {
      return new Observable(observer => {
        this.firestore.firestore
          .collection('users').doc(this.authP.getCurrentUser().uid.toString())
          .collection('media').where('type', '==', MediaType[type])
          .onSnapshot((snapshot) => {
            var items = [] as [MediaData];
            snapshot.forEach(element => {
              items.push(element.data() as MediaData);
            });
            observer.next(items);
          },
            (err) => {
              // on error, close the subscription
              observer.complete();
            });
        // observer does not end until app close.
      });
    }
  }
}
