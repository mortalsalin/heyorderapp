import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { AuthData } from '../providers/auth-data/auth-data'
import { DatabaseProvider } from '../providers/database/database'

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { config } from '../config/config';
import { Push } from '@ionic-native/push';
import { GalleryModal, ZoomableImage } from 'ionic-gallery-modal';

import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    GalleryModal,
    ZoomableImage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GalleryModal,
    ZoomableImage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthData,
    GooglePlus,
    Facebook,
    DatabaseProvider,
    Push
  ]
})
export class AppModule {}
