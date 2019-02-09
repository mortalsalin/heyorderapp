import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import _ from "lodash";
// We MUST import both the firebase AND firestore modules like so
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class FirestoreService {
  
    private db: any;
  private mainCategories = [
    {
      category: 'restaurant',
      subItems: 'restaurantSubItems',
      items: [{ itemName: 'lunch', categoryId: '9' }, { itemName: 'dinning', categoryId: '10' }, { itemName: 'dessert', categoryId: '12' }, { itemName: 'coffee', categoryId: '11' }],
    }
  ];

    ionicSectionNames = {
        restaurant: '/#/restaurant-category-reference'
    }

    constructor(public http: Http) {
        // Initialise access to the firestore service
        this.db = firebase.firestore();
    }

    createAndPopulateDocument(collectionName: string, docID: string, dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db
                .collection(collectionName)
                .doc(docID)
                .set(dataObj, { merge: true })
                .then((data: any) => {
                    console.log(data);
                    resolve(data);
                })
                .catch((error: any) => {
                    console.log(error)
                    reject(error);
                });
        });
    }

    addCollection(collectionName: string, dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db
                .collection(collectionName)
                .add(dataObj)
                .then((data: any) => {
                    console.log(data);
                    resolve(data);
                })
                .catch((error: any) => {
                    console.log(error)
                    reject(error);
                });
        });
    }


    getDocuments(collection: string, where = []): Promise<any> {
        return new Promise((resolve, reject) => {
            var ref = this.db.collection(collection).where(...where).get()
                .then((querySnapshot) => {
                    let arr = [];
                    querySnapshot.forEach(function (doc) {
                        var obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        console.log(obj)
                        arr.push(obj);
                    });

                    if (arr.length > 0) {
                        console.log("Document data:", arr);
                        resolve(arr);
                    } else {
                        console.log("No such document!");
                        resolve(null);
                    }


                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    getAllCollections(collection: string): Promise<any> {
        return new Promise((resolve, reject) => {
            var ref = this.db.collection(collection).get()
                .then((querySnapshot) => {
                    let arr = [];
                    querySnapshot.forEach(function (doc) {
                        var obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        console.log(obj)
                        arr.push(obj);
                    });

                    if (arr.length > 0) {
                        console.log("Document data:", arr);
                        resolve(arr);
                    } else {
                        console.log("No such document!");
                        resolve(null);
                    }


                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }


    getDocumentsByName(collection: string, documentName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            var ref = this.db.collection(collection).doc(documentName);
            ref.get()
                .then((doc) => {
                  if(doc.exists){
                    let obj = JSON.parse(JSON.stringify(doc.data()));
                    obj.$key = doc.id
                    if (!!obj) {
                        console.log("Document data:", obj);
                        resolve(obj);
                    } else {
                        console.log("No such document!");
                        resolve(null);
                    }
                  }else{
                      resolve(null);
                  }


                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }


    addDocumentByName(collectionName: string, docName: string, dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collectionName)
                .doc(docName)
                .set(dataObj)
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }


    addDocument(collectionName: string, dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collectionName).add(dataObj)
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }


    deleteDocument(collectionName: string, docID: string): Promise<any> {
        let that = this;
        return new Promise((resolve, reject) => {
            this.db
                .collection(collectionName)
                .doc(docID)
                .delete()
                .then((obj: any) => {
                    that.deleteCollection(that.db, that.db.collection(collectionName).doc(docID).collection('sub'), 10).then((o) => {
                        resolve(obj);
                    });
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    updateDocument(collectionName: string, docID: string,dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db
                .collection(collectionName)
                .doc(docID)
                .update(dataObj)
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    migrateDataToFirestoreFromJson(collectionName: string = ''): Promise<any> {
        let that = this;
        this.removeAllSubCollection();
        return new Promise((resolve, reject) => {
            let data = this.http.get('assets/data/firebase_data.json').map((res) => res.json());
            data.subscribe((e) => {
                console.log(e)

                let keys = [];

                if (collectionName != '') {
                   keys.push(collectionName);
                } else {
                    keys = Object.keys(e);
                    keys.splice(keys.indexOf('placesSubItems'), 1);
                    keys.splice(keys.indexOf('shoppingSubItems'), 1);
                    keys.splice(keys.indexOf('restaurantSubItems'), 1);
                }
               
                keys.forEach((str, i) => {
                    this.removeCollection(str).then(() => {
                        if (e[str].length > 0) {
                            e[str].forEach((el) => {
                                that.addCollection(str, el).then((data: any) => {
                                    console.log("Added " + str + "documents");
                                    console.log(el);
                                    if (i == keys.length - 1) {
                                        resolve(e);
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });

    }

    getJsonKeys() {
        let data = this.http.get('assets/data/firebase_data.json').map((res) => {
            let j = res.json();
            let keys = Object.keys(j);
            keys.splice(keys.indexOf('restaurantSubItems'), 1);
            return keys;
        });
        return data;
    }

    removeCollection(collectionName: string) {
        let collectionRef = this.db.collection(collectionName);
       return this.deleteCollection(this.db, collectionRef, 20);
    }

    removeAllSubCollection() {

        let data = this.http.get('assets/data/firebase_data.json').map((res) => res.json());
        data.subscribe((e) => {

            this.mainCategories.forEach((o) => {
                //get the subcategories array from /list
                let listFiltered = e[o.subItems];

                o.items.forEach((item) => {
                    let listFilteredByCategory = listFiltered.filter((f) => {
                        return f.categoryId == item.categoryId;
                    });

                    listFilteredByCategory.forEach((element) => {
                        this.db.collection(o.category).where('id', '==', item.itemName)
                            .get()
                            .then((querySnapshot) => {
                                if (!!querySnapshot.docs[0]) {
                                    console.log(querySnapshot.docs[0].data());

                                    let collectionRef = this.db.collection(o.category).doc(querySnapshot.docs[0].id)
                                        .collection('sub');
                                    
                                    return this.deleteCollection(this.db, collectionRef, 20);
                                }
                            });


                    });
                    //console.log(listFilteredByCategory);

                });
            });
        });
        
    }

    groupBy(arr, prop) {
        return arr.reduce(function (groups, item) {
            var val = item[prop];
            groups[val] = groups[val] || [];
            groups[val].push(item);
            return groups;
        }, {});
    }
    
    private deleteCollection(db, collectionRef, batchSize) {
        let that = this;
        var query = collectionRef.orderBy('__name__').limit(batchSize);

        return new Promise(function (resolve, reject) {
            that.deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    }

    private deleteQueryBatch(db, query, batchSize, resolve, reject) {
        let that = this;
        query.get()
            .then((snapshot) => {
                // When there are no documents left, we are done
                if (snapshot.size == 0) {
                    return 0;
                }

                // Delete documents in a batch
                var batch = db.batch();
                snapshot.docs.forEach(function (doc) {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(function () {
                    return snapshot.size;
                });
            }).then(function (numDeleted) {
                if (numDeleted <= batchSize) {
                    resolve();
                    return;
                }

                // Recurse on the next process tick, to avoid
                // exploding the stack.
                Promise.resolve().then(function () {
                    that.deleteQueryBatch(db, query, batchSize, resolve, reject);
                });
            })
            .catch(reject);
    }


    //insert sub-categories for Shopping, Restaurant and City Tour categories
    insertSubCategories(): Promise<any> {

        return new Promise((resolve, reject) => {
            //get json
            let data = this.http.get('assets/data/firebase_data.json').map((res) => res.json());
            data.subscribe((e) => {

                this.mainCategories.forEach((o, i) => {
                    //get the subcategories array from /list
                    let listFiltered = e[o.subItems];

                    o.items.forEach((item) => {
                        let listFilteredByCategory = listFiltered.filter((f) => {
                            return f.categoryId == item.categoryId;
                        });

                        listFilteredByCategory.forEach((element) => {

                            this.db.collection(o.category).where('id', '==', item.itemName)
                                .get()
                                .then((querySnapshot) => {
                                    if (!!querySnapshot.docs[0]) {
                                        console.log(querySnapshot.docs[0].data());
                                        this.db.collection(o.category).doc(querySnapshot.docs[0].id)
                                            .collection('sub').add(element);
                                    }
                                    if (i == this.mainCategories.length - 1) {
                                        resolve(e);
                                    }
                                });
                        });
                    });
                });
            });
        });
    }


    getSubCategoryDocs(masterCollection: string, docId: string, subCollection: string): Promise<any> {
        return new Promise((resolve, reject) => {

            var ref = this.db.collection(masterCollection).doc(docId)
                .collection(subCollection)
                .get()
                .then((querySnapshot) => {
                    let arr = [];
                    querySnapshot.forEach(function (doc) {
                        var obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        console.log(obj)
                        arr.push(obj);
                    });

                    if (arr.length > 0) {
                        console.log("Document data:", arr);
                        resolve(arr);
                    } else {
                        console.log("No such document!");
                        resolve(null);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
    
    addSubCollectionDocument(masterCollection: string, docId: string, subCollection: string, dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(masterCollection).doc(docId)
                .collection(subCollection)
                .add(dataObj)
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    updateSubCollectionDocument(masterCollection: string, docId: string, subCollection: string, subDoc: string, dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db
                .collection(masterCollection)
                .doc(docId)
                .collection(subCollection)
                .doc(subDoc)
                .update(dataObj)
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    deleteSubCollectionDocument(collectionName: string, docID: string, subCollectionName: string, subDoc: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db
                .collection(collectionName)
                .doc(docID)
                .collection(subCollectionName)
                .doc(subDoc)
                .delete()
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

  


}
