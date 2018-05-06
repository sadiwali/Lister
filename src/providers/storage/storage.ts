import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaData } from '../firestore/firestore';
import { MediaType } from '../ani-search/ani-search';

/*
  This class handles all list storage, search, and querying of list data.
  
*/
@Injectable()
export class StorageProvider {

  private mainLists: MediaData[][] = [] as MediaData[][]; // data wont change
  private dispLists: MediaData[][] = [] as MediaData[][]; // data may change

  constructor(public http: HttpClient) { this.initializeLists(); }
  /* Initialize the lists in provider. Clear them. */
  initializeLists() {
    // clear the lists
    this.mainLists = [] as MediaData[][];
    this.dispLists = [] as MediaData[][];
    // populate with correct number of empty lists
    for (let type in MediaType) {
      this.mainLists.push([] as MediaData[]);
      this.dispLists.push([] as MediaData[]);
    }
  }
  /* Get the total number of items in list */
  getTotalItems(type: MediaType): number {
    return this.mainLists[type].length;
  }
  /* Get a list from the display lists */
  getDispList(type: MediaType): MediaData[] {
    return this.dispLists[type];
  }
  /* Update the stored lists given raw main list */
  updateLists(resList: MediaData[]) {
    if (resList.length == 0) {
      // if given list is empty, nothing to filter
      this.initializeLists();
      return;
    }
    // first sort, then begin filtering
    this.mainLists[MediaType.ENTIRE] = this.sortList(resList);
    this.mainLists[MediaType.ANIME] = this.filterByType(MediaType.ANIME);
    this.mainLists[MediaType.MANGA] = this.filterByType(MediaType.MANGA);
    this.mainLists[MediaType.SHOW] = this.filterByType(MediaType.SHOW);
    this.mainLists[MediaType.MOVIE] = this.filterByType(MediaType.MOVIE);
    // copy main list into display
    this.dispLists = this.mainLists.slice();
  }
  /* Reset a display list, set to original */
  resetDispList(type: MediaType) {
    this.dispLists[type] = this.mainLists[type];
  }
  /* Reset all display lists */
  resetAllDispLists() {
    this.dispLists = this.mainLists.slice();
  }
  /* Set the display list */
  setDispList(type: MediaType, resList: MediaData[]) {
    this.dispLists[type] = resList;
  }
  /* filter the display list based on search query */
  searchList(type: MediaType, query: string) {
    // set the display list to the result of the filtering
    this.dispLists[type] = this.mainLists[type].filter(x =>
      x.title.toLowerCase().includes(query.toLowerCase()));
  }
  /* Get an item from the display list */
  getDisplayData(type: MediaType, index: number): MediaData {
    return this.dispLists[type][index];
  }
  /* Sort the list by date */
  private sortList(list: MediaData[]): MediaData[] {
    return list.sort(this.compareDates);
  }
  /* sort function for sorting dates in chronological order */
  private compareDates(a: MediaData, b: MediaData) {
    if ((a.watchDate as Date) < (b.watchDate as Date)) {
      return -1;
    } else if ((a.watchDate as Date) > (b.watchDate as Date)) {
      return 1;
    } else {
      return 0;
    }
  }
  /* filter the mainList by given type, then return the resulting list */
  private filterByType(type: MediaType): MediaData[] {
    return this.mainLists[MediaType.ENTIRE].filter(x => x.type.toLowerCase()
    === MediaType[type].toLowerCase());
  }
}
