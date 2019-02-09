import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Restaurant } from './restaurant';
import { Http } from '@angular/http';
import _ from "lodash";
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../../firestore/firestore.service';
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'tab-restaurant',
    templateUrl: './tab.restaurant.component.html',
    styleUrls: ['tab.restaurant.component.scss']
})
export class RestaurantComponent implements OnInit{
  tempPrice: string;
  tempName: string;
  tempSize: string;
    isLoading: boolean;
    subsTotal: number;

    color = '#ccc';
    modalRefRestaurant: any;
    modelRestaurant: {
    };
    currentItem: any;
   
    subs: any;
    items: any[];
    searchTerm: string;
    intermediary: any[];
    types: any;
    selectedType: string;
  category$: any[];
  public modalRef: BsModalRef;
  model: Restaurant = new Restaurant();
  adding: boolean = false;

  showCategories: boolean = true;
  showRestaurantSub: boolean = false;

  constructor(private http: Http, 
              private af: AngularFireDatabase, 
              private modalService: BsModalService,
              private cdr: ChangeDetectorRef,
              private config: NgbDropdownConfig,
              private db: FirestoreService) {
                config.placement = 'right';
                config.autoClose = 'outside';
  }
  
  ngOnInit(): void {
      this.loadData();
      this.cdr.detectChanges();
      this.selectedType = 'restaurant';
  }

  loadData() {
      this.isLoading = true;
      this.db.getAllCollections('restaurant').then((data) => {
          this.category$ = data;
          
          this.items = data;
          this.isLoading = false;
          
      });
  }

  search() {
      if (this.searchTerm == '') {
          this.items = this.category$;
      } else if (this.items && this.searchTerm != undefined) {
          let res = this.category$.filter((e) => {
              e.description = e.description || '';
              e.name = e.name || '';

              console.log((e.name == e.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) || (e.description == e.description.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) == true?"found":"not found")

              return (e.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) || (e.description.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
          });
          this.items = res;
      }
  }

 

  openModal(template: TemplateRef<any>, item: object, addFlag: boolean) {
    if (addFlag === true) {
      this.adding = true;
      this.model = {};
      this.model.type = 'restaurant';
    } else {
      this.adding = false;
      this.model = item;
    }
    this.modalRef = this.modalService.show(template);
  }

  deleteRecord(item: any) {
      this.db.deleteDocument('restaurant', item.$key);
      this.loadData();
  }

  editOrAddRecord(model: any, addFlag: boolean): void { 
    var data = {
      description: model.description ? model.description : null, 
      name: model.name ? model.name : null,
      show: model.show ? model.show : false, 
      type: model.type ? model.type : null,
      total: model.total ? model.total : null,
      imgBg: model.imgBg ? model.imgBg : null
    };
    console.log('data',data);
    if (addFlag === true) {
      // Add Record
        this.db.addDocument('restaurant', data);
        
      this.modalRef.hide()
    } else {
      // Edit Record
        this.db.updateDocument('restaurant', model.$key, data);
      this.modalRef.hide()
    }
    this.loadData();
  }



  //----------------------------Restaurant------------------------------------------------

  openModalRestaurant(template: TemplateRef<any>, item: object, addFlag: boolean) {
      if (addFlag === true) {
          this.adding = true;
          this.modelRestaurant = {};
      } else {
          this.adding = false;
          this.modelRestaurant = item;
      }
      this.modalRefRestaurant = this.modalService.show(template);
  }

  editOrAddRecordRestaurant(model: any, addFlag: boolean): void {
      var data = {
          description: model.description ? model.description : null,
          name: model.name ? model.name : null,
          price: model.price ? model.price : false,
          discount: model.discount ? model.discount : null,
        imgSmall: model.imgSmall ? model.imgSmall : null,
        options: model.options ? model.options : null,
          size: model.size? model.size: null
      };
      console.log('data', data);
      if (addFlag === true) {
          // Add Record
        this.db.addSubCollectionDocument('restaurant', this.currentItem.$key, 'sub', data);

          this.modalRefRestaurant.hide()
      } else {
          // Edit Record
        this.db.updateSubCollectionDocument('restaurant', this.currentItem.$key, 'sub', model.$key, data);
          this.modalRefRestaurant.hide()
      }
      this.getSubCategory(this.currentItem);
    this.tempSize = '';
    this.tempName = '';
    this.tempPrice = '';
  }

  deleteRecordRestaurant(item: any) {
    this.db.deleteSubCollectionDocument('restaurant', this.currentItem.$key, 'sub', item.$key);
      //re-load the data
      this.getSubCategory(this.currentItem);
  }

 
 //------------general-----------------------------------------------------------------

  getSubCategory(item) {
      this.isLoading = true;
      this.db.getSubCategoryDocs('restaurant', item.$key, 'sub').then((e) => {
          console.log(e);
          this.showViewHandler(item.type);
          this.subs = e;
          this.isLoading = false;
      });
  }

  showViewHandler(showView) {
      this.showCategories = false;
      this.showRestaurantSub = false;

      if (showView == 'category') {
          this.showCategories = true;
          return;
      }

      if (showView == 'restaurant') {
          this.showRestaurantSub = true;
      } 
  }

  getSubCategoryTotal(item) {
      this.db.getSubCategoryDocs('restaurant', item.$key, 'sub').then((e) => {
          if (!e) {
              this.subsTotal = 0;
              return;
          }
          this.subsTotal = e.length;
      });
  }

  capitalCase(str) {
      if (!!str && !!str[0]) {
          str = str.replace(/(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); });
      }
      return str;
  }

  launchApp() {
      this.db.getDocumentsByName('configuration', 'ionicurl').then((data) => {
          if (!data) {
              alert('Please go to Data Management section and introduce an URL');
          }
          window.open(data.url + this.db.ionicSectionNames[this.selectedType], '_blank', 'location=yes,height=640,width=360,scrollbars=yes,status=yes');
      });
      
  }

  removeExtra(obj, i) {
    if (obj && obj.length > 0) {
      obj.splice(i, 1);
    }
  }

  addSize(modelRestaurant) {
    modelRestaurant.size = !modelRestaurant.size ? [] : modelRestaurant.size
    modelRestaurant.size.push({ size: this.tempSize });
    this.tempSize = '';
  }

  addOption(modelRestaurant) {
    modelRestaurant.options = !modelRestaurant.options ? [] : modelRestaurant.options;
    modelRestaurant.options.push({ name: this.tempName, price: this.tempPrice })
    this.tempName = '';
    this.tempPrice = '';
  }

}
