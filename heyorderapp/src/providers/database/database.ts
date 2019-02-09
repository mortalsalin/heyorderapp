import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/firestore';



@Injectable()
export class DatabaseProvider {

    private db: any;

    constructor() {
        // Initialise access to the firestore service
        this.db = firebase.firestore();
    }

    getAllDocuments(collection: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection)
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


    getDocuments(collection: string, where = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).where(...where).get()
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
            this.db.collection(collection).get()
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
                    if (doc.exists) {
                        let obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        if (!!obj) {
                            console.log("Document data:", obj);
                            resolve(obj);
                        } else {
                            console.log("No such document!");
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }


                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

      getSubCategoryCondition(masterCollection: string, docId: string, subCollection: string, where= []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(masterCollection).doc(docId)
                .collection(subCollection)
                .where(...where)
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

    getSubCategoryDocs(masterCollection: string, docId: string, subCollection: string): Promise<any> {
        return new Promise((resolve, reject) => {
             this.db.collection(masterCollection).doc(docId)
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

    getSubCategoryDocByname(masterCollection: string, docId: string, subCollection: string, subDoc: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(masterCollection).doc(docId)
                .collection(subCollection)
                .doc(subDoc)
                .get()
                .then((doc) => {
                    var obj = JSON.parse(JSON.stringify(doc.data()));
                    obj.$key = doc.id

                    resolve(obj);

                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    deleteDocument(collectionName: string, docID: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db
                .collection(collectionName)
                .doc(docID)
                .delete()
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

    updateDocument(collectionName: string, docID: string, dataObj: any): Promise<any> {
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

}
