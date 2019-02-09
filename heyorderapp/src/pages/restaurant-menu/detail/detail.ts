import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup
import { DatabaseProvider } from '../../../providers/database/database';
import { Observable } from "rxjs/Observable";
import { GalleryModal } from "ionic-gallery-modal";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class RestaurantDetailPage {
  itemFromCart: any;
  selectedSize: any;
  selectedOptions: any;
  uid: string;
  prodName: any;
  subDoc: any;
  totalItemsInCart: number;

  itemId: any;
  item: any;
  itemOption: FirebaseListObservable<any[]>;
  itemSize: FirebaseListObservable<any[]>;

  itemOptionArray: any = [];
  itemSizeArray: any = [];
  favorite: boolean = false;

  showToolbar: boolean = false;
  transition: boolean = false;
  headerImgSize: string = '100%';
  headerImgUrl: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public afDB: AngularFireDatabase, public ref: ChangeDetectorRef,
    private toastCtrl: ToastController, public db: DatabaseProvider, public modalCtrl: ModalController, public afAuth: AngularFireAuth, public alertCtrl: AlertController) {

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.itemId = this.navParams.get('itemId');
    this.subDoc = this.navParams.get('subDoc');
    this.prodName = this.navParams.get('prodName');

    this.itemFromCart = this.navParams.get('item')
    this.selectedOptions = this.itemFromCart ? this.itemFromCart.selectedOptions : [];
    this.selectedSize = this.itemFromCart ? this.itemFromCart.selectedSize : [];

    let that = this;
    db.getSubCategoryDocByname('restaurant', this.itemId, 'sub', this.subDoc)
      .then(function (e) {
        if (!!e) {
          if (e.options && that.selectedOptions) {
            e.options.forEach((s) => {
              s.model = that.selectedOptions.filter((x) => { return x.name == s.name }).length > 0 ;//when load product from cart make sure that the options selected reflect selected
            })
          }

          if (e.size && that.selectedSize) {
            e.size.forEach((s) => {
              s.model = that.selectedSize.indexOf(s.size) > -1;//when load product from cart make sure that the options selected reflect selected
            })
          }

          that.item = e;
          that.itemOption = <FirebaseListObservable<any>>Observable.of(e.options);
          that.itemOptionArray = e.options || [];
          that.itemSize = <FirebaseListObservable<any>>Observable.of(e.size);
          that.itemSizeArray = e.size || [];
        }
        loadingPopup.dismiss()
      });

    this.getTotalItemsOnCart();
  }


  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 100;
    if (scrollTop < 0) {
      this.transition = false;
      this.headerImgSize = `${Math.abs(scrollTop) / 2 + 100}%`;
    } else {
      this.transition = true;
      this.headerImgSize = '100%'
    }
    this.ref.detectChanges();
  }


  addToFav() {
    this.favorite = !this.favorite;
    this.presentToast('bottom', 'Adicionar aos favoritos');
  }

  presentToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 1000
    });
    toast.present();
  }

  fullscreenImage(getImage) {
    let modal = this.modalCtrl.create(GalleryModal, {
      // For multiple images //
      //photos: this.imgGalleryArray,
      // For single image //
      photos: [{ url: getImage }],
      closeIcon: 'close-circle',
      //initialSlide: getIndex
    });
    modal.present();
  }


  getTotalItemsOnCart() {
    let that = this;
    this.afAuth.authState.subscribe(userAuth => {

      if (userAuth) {
        this.uid = !!userAuth ? userAuth.uid : null;
        this.db.getDocuments('cart', ['uid', '==', this.uid])
          .then(function (e) {
            if (!!e) {

              let cart = e.filter((x) => {
                return !x.bought && x.type == 'restaurant'
              });

              that.totalItemsInCart = cart.length;
            }
          });
      }
    });
  }

  addToCart() {

    this.afAuth.authState.subscribe(userAuth => {
      if (!userAuth) {
        this.showLoginChoices();
        return;
      }

      this.uid = userAuth.uid;
      let price = !!this.item.discount ? this.item.discountPrice : this.item.price;

      this.db.getDocuments('cart', ['uid', '==', userAuth.uid]).then((x) => {

        let selectedOpt = [];
        if (this.item.options && this.item.options.length > 0) {
          this.item.options.forEach((e) => {
            if (e.model)
              selectedOpt.push({ name: e.name, price: e.price })
          })
        }

        let selectedSize = [];
        if (this.item.size && this.item.size.length > 0) {
          this.item.size.forEach((e) => {
            if (e.model)
              selectedSize.push(e.size)
          })
        }

        if (!!x || (!!x && x.length > 0)) {

          var exist = x.filter((i) => {
            return i.itemKey == this.subDoc && !i.bought;
          })

          //if item was already added to the cart
          if (!!exist && exist.length > 0) {

            //update item in the cart
            let obj = exist[0];
            this.db.updateDocument('cart', obj.$key, {
              type: this.item.type,
              categoryKey: this.itemId,
              itemKey: this.subDoc,
              img: this.item.imgSmall,
              price: price,
              name: this.item.name,
              uid: this.uid,
              qty: 1,
              selectedOptions: selectedOpt,
              selectedSize: selectedSize

            }).then(() => {
              //item already added to the cart
              const toast = this.toastCtrl.create({
                message: 'Item atualizado no pedido',
                position: 'bottom',
                duration: 3000
              });

              this.getTotalItemsOnCart();
              toast.present();
            })

            return;

          }
        }


        //if item doesn't exist add it
        this.db.addDocument('cart', {
          type: this.item.type,
          categoryKey: this.itemId,
          itemKey: this.subDoc,
          img: this.item.imgSmall,
          price: price,
          name: this.item.name,
          uid: this.uid,
          qty: 1,
          selectedOptions: selectedOpt,
          selectedSize: selectedSize

        }).then(() => {
          const toast = this.toastCtrl.create({
            message: 'Item adicionado ao pedido',
            position: 'bottom',
            duration: 3000
          });
          toast.present();
          this.getTotalItemsOnCart();

        });

      });


    });
  }


  showLoginChoices() {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Você precisa estar logado para visualizar os itens do pedido",

      buttons: [
        {
          text: 'Login',
          handler: data => {
            this.navCtrl.push('LoginPage');
          }
        }
      ]
    });
    prompt.present();
  }

  buyNow() {
    this.navCtrl.parent.select(1);
  }


}
