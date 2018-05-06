import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaData } from '../firestore/firestore';
import { MediaType } from '../ani-search/ani-search';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  private mainLists: [MediaData[]] = [] as [MediaData[]];
  private dispLists: [MediaData[]] = [] as [MediaData[]];

  constructor(public http: HttpClient) { 
    // create the required number of lists
    for(let type in MediaType) {
      this.mainLists.push([] as MediaData[]);
      this.dispLists.push([] as MediaData[]);
    }
  }

  /* Get the total number of items in list */
  getTotalItems(): number {
    return this.mainLists[MediaType.ENTIRE].length;
  }

  /* Update the stored lists given raw main list */
  updateLists(resList: MediaData[]) {
    this.mainLists[MediaType.ENTIRE] = resList; // the entire section stores all
    this.mainLists[MediaType.ANIME] = this.filterByType(MediaType.ANIME);
    this.mainLists[MediaType.MANGA] = this.filterByType(MediaType.MANGA);
    this.mainLists[MediaType.SHOW] = this.filterByType(MediaType.SHOW);
    this.mainLists[MediaType.MOVIE] = this.filterByType(MediaType.MOVIE);
    this.dispLists = this.mainLists; // initially, they are the same
  }

  /* Get a list from the main lists */
  getMainList(type: MediaType): MediaData[] {
    return this.mainLists[type];
  }

  /* Get a list from the display lists */
  getDispList(type: MediaType): MediaData[] {
    return this.dispLists[type];
  }

  /* Reset a display list */
  resetDispList(type: MediaType) {
    this.dispLists[type] = this.mainLists[type];
  }

  /* Set the display list */
  setDispList(type: MediaType, resList: MediaData[]) {
    this.dispLists[type] = resList;
  }

  /* Sort the list by date */
  private sortList(list: MediaData[]): MediaData[] {
    let res = list.sort(this.compareDates);
    console.log(list, res);
    return res;
  }

  private compareDates(a: MediaData, b: MediaData) {
    if ((a.watchDate as Date) < (b.watchDate as Date)) {
      return -1;
    } else if ((a.watchDate as Date) > (b.watchDate as Date)) {
      return 1;
    } else {
      return 0;
    }
  }

  private filterByType(type: MediaType): MediaData[] {
    return this.mainLists[MediaType.ENTIRE].filter(x => x.type.toLowerCase()
    === MediaType[type].toLowerCase());
  }




}
