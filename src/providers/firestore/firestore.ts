import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthProvider } from '../auth/auth';
import { MediaType } from '../ani-search/ani-search';
import { Observable } from 'rxjs/Observable';

/* Represents an item in a media list */
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
/* Return codes for FireStore */
export enum FsReturnCodes {
  DUPLICATE,
  ERROR,
  SUCCESS,
  NO_DUPLI_CHECK
}
/* Represents user data stored in the database */
export interface UserData {
  rawJoinDate: Date
}

/* This provider handles all firestore database insertions and queries */
@Injectable()
export class FirestoreProvider {

  constructor(public http: HttpClient, public firestore: AngularFirestore,
    public authP: AuthProvider) { }

  /* Add the given MediaData object into the database */
  addMedia(data: MediaData): Promise<FsReturnCodes> {
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
  /* Update the media already stored in the database with given id (not doc id) */
  updateMedia(id: string, newData: any): Promise<any> {
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
              // could not update the document
              reject();
            })
        }).catch(err => {
          // could not get that document
          reject();
        });
    });
  }
  /* Actually add given data to the database as a show, anime, movie, etc. */
  private addToDatabase(data: MediaData): Promise<any> {
    return this.firestore.collection('users')
      .doc(this.authP.getCurrentUser().uid.toString()).collection('media')
      .add(data);
  }
  /* Get all items in list of given type. If a live updated list is requierd,
     use subscribeAll() instead. 
  */
  getAll(type: MediaType): Promise<MediaData[]> {
    return new Promise((resolve, reject) => {
      this.firestore.firestore
        .collection('users').doc(this.authP.getCurrentUser().uid.toString())
        .collection('media').where('type', '==', MediaType[type]).get()
        .then((res) => {
          let arr = [] as MediaData[]; // array to return containing results
          res.forEach((data) => {
            arr.push(data.data() as MediaData);
          });
          resolve(arr); // send back the list of MediaData
        }).catch((err) => {
          // could not query
          reject(FsReturnCodes.ERROR);
        })
    });
  }
  /* one time code for me */
  importfromfile(file) { }
  /* Delete a record from a collection, given its id (not doc id) */
  delete(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore.firestore.collection('users')
        .doc(this.authP.getCurrentUser().uid.toString())
        .collection('media').where('id', '==', id).get().then(data => {
          let docId = data.docs[0].id; // there should only be one, get its id
          // delete the doc
          this.firestore.firestore.collection('users')
            .doc(this.authP.getCurrentUser().uid.toString())
            .collection('media').doc(docId).delete()
            .then(() => resolve()).catch(() => reject());
        }).catch(err => {
          // could not find that document
          reject();
        });
    });
  }
  /* Subscribe live to a list for displaying in real time */
  subscribeAll(type: MediaType = null): Observable<MediaData[]> {
    if (!type) {
      // subscribe to everything in collection
      return new Observable(observer => {
        this.firestore.firestore
          .collection('users').doc(this.authP.getCurrentUser().uid.toString())
          .collection('media').onSnapshot(snapshot => {
            var items = [] as MediaData[];
            snapshot.forEach(element => {
              items.push(element.data() as MediaData);
            });
            observer.next(items); // send an update
          },
            (err) => {
              // on error, do nothing
            });
      });
    } else {
      return new Observable(observer => {
        this.firestore.firestore
          .collection('users').doc(this.authP.getCurrentUser().uid.toString())
          .collection('media').where('type', '==', MediaType[type])
          .onSnapshot((snapshot) => {
            var items = [] as MediaData[];
            snapshot.forEach(element => {
              items.push(element.data() as MediaData);
            });
            observer.next(items); // send an update
          },
            (err) => {
              // on error, do nothing
            });
      });
    }
  }

  getUserData(): Promise<UserData> {
    return new Promise((resolve, reject) => {
      this.firestore.firestore.collection('users')
        .doc(this.authP.getCurrentUser().uid.toString()).collection('userinfo')
        .doc('userinfo').get().then(data => {
          resolve(data.data() as UserData);
        }).catch(err => {
          reject();
        });
    });
  }
}
