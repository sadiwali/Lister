import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as imdb from '../../../node_modules/imdb-api';


/* Represents a type of media */
export enum MediaType {
  ANIME,
  SHOW,
  MOVIE,
  MANGA,
  ENTIRE
}
/* Represents an available (used) API */
export enum Api {
  ANILIST,
  IMDB
}
/* Represents a search result item, this object is displayed on search */
export interface SearchResultItem {
  id: number;
  title: string;
  startDate: {
    day: number,
    month: number,
    year: number
  };
  coverImage: {
    medium: string,
    large: string
  };
  type: string;
  source: string;
}

/*
  This provider handles all media search and get operations
*/
@Injectable()
export class AniSearchProvider {

  private url = 'https://graphql.anilist.co'; // URL for anilist api
  private apiKey = "6288db53"; // private key for IMDB api


  constructor(public http: HttpClient) { }
  /* Get an item based on the type */
  get(title: string, type: MediaType): Promise<SearchResultItem> {
    if (type == MediaType.MOVIE || type == MediaType.SHOW) {
      return new Promise((resolve, reject) => {
        this.getImdb(title, type).then((data) => { resolve(data) }).catch((err) => { reject(err) });
      });
    } else if (type == MediaType.ANIME || type == MediaType.MANGA) {
      return new Promise((resolve, reject) => {
        this.getAni(title, type).then((data) => { resolve(data) }).catch((err) => { reject(err) });
      });
    } else {
      // no module found for this type
      console.log("no module can handle this type.");
      return null;
    }
  }
  /* Perform a query based on the type */
  async search(query: string, type: MediaType = null): Promise<SearchResultItem[]> {
    console.log("seraching");
    // TODO: make the search all more elegant
    if (type == MediaType.MOVIE || type == MediaType.SHOW) {
      return new Promise((resolve, reject) => {
        this.searchImdb(query, type).then((data) => { resolve(data) }).catch((err) => { reject(err) });
      }) as Promise<SearchResultItem[]>;
    } else if (type == MediaType.ANIME || type == MediaType.MANGA) {
      return new Promise((resolve, reject) => {
        this.searchAni(query, type).then((data) => { resolve(data) }).catch((err) => { reject(err) });
      }) as Promise<SearchResultItem[]>;
    } else {
      // search all
      console.log("searching all");
      let aniData: any;
      let errCount: number = 0;
      try {
        aniData = await this.searchAni(query);
      } catch (e) {
        // do nothing
        errCount++;
      }

      let imdbData: any;
      try {
        imdbData = await this.searchImdb(query);
      } catch (e) {
        errCount++;
      }

      let toRet = [];
      if (aniData && imdbData) {
        // merge them and return
        toRet = aniData.concat(imdbData);
        console.log("both");
      } else if (aniData) {
        toRet = aniData;
        console.log("ani");

      } else if (imdbData) {
        toRet = imdbData;
        console.log("imdb");

      }

      return new Promise((resolve, reject) => {
        if (errCount >= 2) {
          // both apis had issues
          reject(toRet);
        } else {
          // none or at least 1 had issues, still can display the other
          resolve(toRet);
        }
      }) as Promise<SearchResultItem[]>;
      // return new Promise((resolve, reject) => {
      //   this.searchAni(query).then(aniData => {
      //     this.searchImdb(query).then(imdbData => {
      //       resolve(aniData.concat(imdbData));
      //     }).catch(err => {
      //       // could not get from imdb api
      //       resolve(aniData); // send back just 
      //     });
      //   }).catch(err => {
      //     // searchAni had an issue
      //   }).then(() => {
      //     // aniData is not here, so nothing to get
      //     this.searchImdb(query).then(imdbData => {
      //       resolve(imdbData);
      //     }).catch(err => {
      //       reject(err);
      //     });
      //   })
      // });
    }
  }
  /* Get an item on the AniList DB using GraphQL. */
  getAni(title: string, type: MediaType): Promise<SearchResultItem> {
    // define query variables
    var variables = {
      "type": MediaType[type],
      "search": title
    };
    // define the query
    var query = `
    query ($type: MediaType, $search: String) {
      Media(search: $search, type: $type) {
        id
        title {
          romaji
          native
        }
        startDate {
          year
          month
          day
        }
        coverImage {
          medium
          large
        }
      }
    }
    `;

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };
    // return the promise
    return new Promise((resolve, reject) => {
      // attempt to fetch data
      fetch(this.url, options).then((response) => {
        // data received
        response.json().then((json) => {
          // return data if response was good, otherwise reject promise
          if (response.ok) {
            // for each item in list

            // search result json
            let sr_json = {} as SearchResultItem;

            sr_json.id = (json.data.Media as any).id;
            sr_json.title = (json.data.Media as any).title.romaji;
            sr_json.coverImage = (json.data.Media as any).coverImage;
            sr_json.startDate = (json.data.Media as any).startDate;
            sr_json.source = Api[Api.ANILIST];
            sr_json.type = MediaType[type];
            resolve(sr_json);
          } else {
            reject(json);
          }
        });
      }).catch((err) => {
        // could not fetch, return the error
        reject(err);
      });
    });
  }




  /* Get an item on the AniList DB using GraphQL. */
  getAniById(id: number, type: MediaType): Promise<SearchResultItem> {
    // define query variables
    var variables = {
      "type": MediaType[type],
      "id": id
    };
    // define the query
    var query = `
    query ($type: MediaType, $id: Int) {
      Media(id: $id, type: $type) {
        id
        type
        title {
          romaji
          native
        }
        startDate {
          year
          month
          day
        }
        coverImage {
          medium
          large
        }
      }
    }    
    
    `;

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };
    // return the promise
    return new Promise((resolve, reject) => {
      // attempt to fetch data
      fetch(this.url, options).then((response) => {
        // data received
        response.json().then((json) => {
          // return data if response was good, otherwise reject promise
          if (response.ok) {
            // for each item in list

            // search result json
            let sr_json = {} as SearchResultItem;
            sr_json.id = (json.data.Media as any).id;
            sr_json.title = (json.data.Media as any).title.romaji;
            sr_json.coverImage = (json.data.Media  as any).coverImage;
            sr_json.startDate = (json.data.Media as any).startDate;
            sr_json.source = Api[Api.ANILIST];
            sr_json.type = MediaType[type];
            resolve(sr_json);
          } else {
            reject(json);
          }
        });
      }).catch((err) => {
        // could not fetch, return the error
        reject(err);
      });
    });
  }



  /* Search for an item on the AniList DB using GraphQL. 

  query: the search query.
  type: the media type.
  page: which page of results to return.
  perPage: how many results per page.

  Returns a list of search result objects.  
  */
  searchAni(query: string, type: MediaType = null, page: number = 1,
    perPage: number = 10): Promise<[SearchResultItem]> {
    // define query variables
    var variables;
    if (type) {
      variables = {
        "type": MediaType[type],
        "search": query,
        "perPage": perPage,
        "page": page
      };
    } else {
      variables = {
        "search": query,
        "perPage": perPage,
        "page": page
      };
    }

    var query = `
    query ($type: MediaType, $search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $search, type: $type) {
          id
          type
          title {
            romaji
            native
          }
          startDate {
            year
            month
            day
          }
          coverImage {
            medium
            large
          }
        }
      }
    }    
    `;

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

    return new Promise((resolve, reject) => {
      fetch(this.url, options).then((response) => {
        response.json().then((json) => {
          if (response.ok) {
            let arr = [] as [SearchResultItem];
            for (let i = 0; i < json.data.Page.media.length; i++) {
              // for each item in list

              // search result json
              let sr_json = {} as SearchResultItem;

              sr_json.id = (json.data.Page.media[i] as any).id;
              sr_json.title = (json.data.Page.media[i] as any).title.romaji;
              sr_json.coverImage = (json.data.Page.media[i] as any).coverImage;
              sr_json.startDate = (json.data.Page.media[i] as any).startDate;
              sr_json.source = Api[Api.ANILIST];
              sr_json.type = (json.data.Page.media[i] as any).type;
              arr.push(sr_json);
            }
            resolve(arr); // return the search result array
          } else {
            reject(json);
          }
        });
      }).catch((err) => {
        reject(err);
      })
    })
  }
  /* Get an item on the IMDB using its API 
  
  title: the title of the media.
  type: the type of media.
 
  Returns the media object.
  */
  getImdb(title: string, type: MediaType): Promise<SearchResultItem> {
    return new Promise((resolve, reject) => {
      imdb.get('The departed', { apiKey: this.apiKey }).then((data) => {

        let sr_json = {} as SearchResultItem;

        sr_json.id = (data as any).imdbid;
        sr_json.title = (data as any).title;
        // create a skeleton for coverImage
        let coverImage = {
          large: "",
          medium: ""
        };
        coverImage.large = (data as any).poster;
        coverImage.medium = null;
        sr_json.coverImage = coverImage;
        // create a skeleton for date
        let startDate = {
          year: 0,
          day: 0,
          month: 0
        }
        // get the date by parts
        let response_date = ((data as any).released as Date);
        startDate.year = response_date.getFullYear();
        startDate.day = response_date.getDate();
        startDate.month = response_date.getMonth();
        sr_json.startDate = startDate;
        sr_json.source = Api[Api.IMDB];
        sr_json.type = (data as any).type.toLowerCase()
          == 'series' ? MediaType[MediaType.SHOW]
          : (data as any).type;
        resolve(sr_json);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  /* Search for an item on the IMDB using its API 
  
  query: the search query.
  type: the media type.
  page: which page of results to return.
  perPage: how many results per page.

  Returns a list of search result objects.  
  */
  searchImdb(query: string, type: MediaType = null, page: number = 1,
    perPage: number = 10): Promise<SearchResultItem[]> {
    console.log("searching imdb");
    return new Promise((resolve, reject) => {
      imdb.search({ title: query }, { apiKey: this.apiKey }).then((data) => {

        let arr: any = [];
        for (let i = 0; i < data.results.length; i++) {

          let sr_json = {} as SearchResultItem;

          sr_json.id = (data.results[i] as any).imdbid;
          sr_json.title = (data.results[i] as any).title;
          // create a skeleton for coverImage
          let coverImage = {
            large: "",
            medium: ""
          };
          coverImage.large = (data.results[i] as any).poster;
          coverImage.medium = coverImage.large;
          sr_json.coverImage = coverImage;
          // create a skeleton for date
          let startDate = {
            year: 0,
            day: 0,
            month: 0
          }
          // get the date by parts  
          startDate.year = (data.results[i] as any).year;
          sr_json.startDate = startDate;
          sr_json.source = Api[Api.IMDB];
          sr_json.type = (data.results[i] as any).type.toLowerCase()
            == 'series' ? MediaType[MediaType.SHOW]
            : (data.results[i] as any).type;
          arr.push(sr_json);
        }
        console.log(arr);
        resolve(arr);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
