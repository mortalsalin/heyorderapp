import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import 'rxjs/add/operator/map';
declare var google;

@IonicPage()
@Component({
  selector: 'restaurant-map',
  templateUrl: 'map.html'
})
export class RestaurantMapPage {
  @ViewChild('map') mapElement: ElementRef;
  items: any[] = [];

  map: any;
  markerSelected: boolean = false;

  mapStyle: any = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }]

  infoWindows: any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
      this.items = this.navParams.get('info');
  }

  ionViewDidEnter() {
      this.displayGoogleMap();
  }


  displayGoogleMap() {
    let latLng = new google.maps.LatLng(13.801532791932946, 100.54677690766607);
    let mapOptions = {
        center: latLng,
        zoom: 17,
        styles: this.mapStyle,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarkersToMap(this.items)
  }


  addMarkersToMap(item) {
          var position = new google.maps.LatLng(item.lat, item.lng);
          var mapMarker = new google.maps.Marker({
              position: position,
              animation: google.maps.Animation.DROP,
              markerSelected: true,
              title: item.name,
              email: item.email,
              web: item.web,
              phone: item.phone,

              //**** Custom Marker Symbols ****/
              //icon:  'assets/red_pin72x96.png'
              icon: {
                  url: 'assets/red_pin72x96.png',
                  //The size image file.
                  size: new google.maps.Size(72, 96),
                  // we want to render @ 30x30 logical px (@2x dppx or 'Retina')
                  scaledSize: new google.maps.Size(40, 52),
                  //The point on the image to measure the anchor from. 0, 0 is the top left.
                  origin: new google.maps.Point(0, 0),
                  //The x y coordinates of the anchor point on the marker. e.g. If your map marker was a drawing pin then the anchor would be the tip of the pin.
                  anchor: new google.maps.Point(20, 40),
                  labelOrigin: new google.maps.Point(20, 12)
              },
              anchorPoint: new google.maps.Point(0, -40)
          });
          mapMarker.setMap(this.map);
          this.addInfoWindowToMarker(mapMarker);
          this.map.setCenter(position);
  
  }



  addInfoWindowToMarker(marker) {

      var infoWindowContent = '<div id="iw-container">' +               
                                  '<div class="iw-content">' +
                                        '<div class="iw-subTitle">'+marker.title+'</div>' +                                  
                                        '<br><b>Phone:</b> '+marker.phone+'<br><b>E-mail:</b>'+marker.email+'<br><b>Website:</b> '+marker.web+'</p>'+
                                  '</div>' +
                                  //'<div id="do-something-button">button</div>' +
                              '</div>';    

      var infoWindow = new google.maps.InfoWindow();
          infoWindow.setContent(infoWindowContent);

          marker.addListener('click', () => {
                this.closeAllInfoWindows();
                infoWindow.open(this.map, marker);
          });
          this.infoWindows.push(infoWindow);
  }

  doSomething(){
    console.log("doSomething");
  }

  closeAllInfoWindows() {
      for(let window of this.infoWindows) { 
        window.close();
      }
  }
 

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
