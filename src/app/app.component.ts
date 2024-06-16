import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Social Media Platform';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument;

  constructor(private loginSheet: MatBottomSheet, private router: Router) {
    this.auth.listenToSignInStateChanges(user => {
      this.auth.checkSignInState({
        whenSignedIn: user => {
          // this.getUserProfile()
          // // Add your logic here if needed
        },
        whenSignedOut: user => {
          AppComponent.userDocument = {} as UserDocument; // Assign an empty object or a default UserDocument
        },
        whenSignedInAndEmailNotVerified: user => {
          this.router.navigate(["emailVerification"]);
        },
        whenSignedInAndEmailVerified: user => {
          this.getUserProfile();
        },
        whenChanged: user => {
          // Add your logic here if needed
        }
      });
    });
  }
  
  public static getUserDocument(){
    return AppComponent.userDocument;
  }
  getUsername() {
    try {
      return AppComponent.userDocument.publicName;
    } catch (err) {
      console.error("Error getting username:", err);
      return null; // or some default value like ''
    }
  }
  
  getUserProfile() {
    return new Promise<number>((resolved, rejected) => {
      const currentUser = this.auth.getAuth().currentUser;
      if (currentUser) {
        this.firestore.listenToDocument({
          name: "Getting Document",
          path: ["Users", currentUser.uid],
          onUpdate: (result) => {
            AppComponent.userDocument = <UserDocument>result.data();
            this.userHasProfile = result.exists;
            AppComponent.userDocument.userId = currentUser.uid;
            if (this.userHasProfile) {
              this.router.navigate(["postfeed"]);
              resolved(1);
            } else {
              resolved(0);
            }
          },
        });
      } else {
        rejected("No user is currently signed in.");
      }
    });
  }
  
  // add(number1, number2) {
  //   return number1 + number2;
  // }
  onLogoutClick(){
    this.auth.signOut();
    this.router.navigate(["**"]);
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string;
}
