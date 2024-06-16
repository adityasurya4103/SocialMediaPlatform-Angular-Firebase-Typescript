// import { Component, OnInit } from '@angular/core';
// import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
// import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
// import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
// import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
// import { MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'app-create-post',
//   templateUrl: './create-post.component.html',
//   styleUrls: ['./create-post.component.css']
// })
// export class CreatePostComponent implements OnInit {
//   selectedImageFile !:File;
//   auth = new FirebaseTSAuth();
//   firestore = new FirebaseTSFirestore();
//   storage = new FirebaseTSStorage();
  
//   constructor(private dialog: MatDialogRef<CreatePostComponent>) { }

//   ngOnInit(): void {}

//   onPostClick(commentInput: HTMLTextAreaElement) {
//     const comment = commentInput.value;
//     if (comment.length <= 0) return;
//     if (this.selectedImageFile) {
//       this.uploadImagePost(comment);
//     } else {
//       this.uploadPost(comment);
//     }
//   }

//   uploadImagePost(comment: string) {
//     const postId = this.firestore.genDocId();
//     if (this.selectedImageFile) {
//       this.storage.upload({
//         uploadName: "Upload Image Post",
//         path: ["Posts", postId, "image"],
//         data: {
//           data: this.selectedImageFile
//         },
//         onComplete: (downloadUrl) => {
//           const currentUser = this.auth.getAuth().currentUser;
//           if (currentUser) {
//             this.firestore.create({
//               path: ["Posts", postId],
//               data: {
//                 comment: comment,
//                 creatorId: currentUser.uid,
//                 imageUrl: downloadUrl,
//                 timestamp: FirebaseTSApp.getFirestoreTimestamp()
//               },
//               onComplete: (docId) => {
//                 this.dialog.close();
//               }
//             });
//           }
//         }
//       });
//     }
//   }

//   uploadPost(comment: string) {
//     const currentUser = this.auth.getAuth().currentUser;
//     if (currentUser) {
//       this.firestore.create({
//         path: ["Posts"],
//         data: {
//           comment: comment,
//           creatorId: currentUser.uid,
//           timestamp: FirebaseTSApp.getFirestoreTimestamp()
//         },
//         onComplete: (docId) => {
//           this.dialog.close();
//         }
//       });
//     }
//   }

//   onPhotoSelected(photoSelector: HTMLInputElement) {
//     if (photoSelector.files && photoSelector.files.length > 0) {
//       this.selectedImageFile = photoSelector.files[0];
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(this.selectedImageFile);
//       fileReader.addEventListener("loadend", ev => {
//         const readableString = fileReader.result?.toString() || '';
//         const postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement;
//         if (postPreviewImage) {
//           postPreviewImage.src = readableString;
//         }
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImageFile! :File;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();
  constructor(private dialog: MatDialogRef<CreatePostComponent>) { }

  ngOnInit(): void {
  }

  onPostClick(commentInput: HTMLTextAreaElement) {
    let comment = commentInput.value;
    if(comment.length <= 0 ) return;
    if(this.selectedImageFile) {
      this.uploadImagePost(comment);
    } else {
      this.uploadPost(comment);
    }
   
  }

  uploadImagePost(comment: string) {
        const postId = this.firestore.genDocId();
        if (this.selectedImageFile) {
          this.storage.upload({
            uploadName: "Upload Image Post",
            path: ["Posts", postId, "image"],
            data: {
              data: this.selectedImageFile
            },
            onComplete: (downloadUrl) => {
              const currentUser = this.auth.getAuth().currentUser;
              if (currentUser) {
                this.firestore.create({
                  path: ["Posts", postId],
                  data: {
                    comment: comment,
                    creatorId: currentUser.uid,
                    likes: 0, // Initialize likes to zero
                    likedBy: [] ,// Initialize likedBy as an empty array
                    imageUrl: downloadUrl,
                    timestamp: FirebaseTSApp.getFirestoreTimestamp()
                  },
                  onComplete: (docId) => {
                    this.dialog.close();
                  }
                });
              }
            }
          });
        }
      }

  uploadPost(comment: string) {
        const currentUser = this.auth.getAuth().currentUser;
        if (currentUser) {
          this.firestore.create({
            path: ["Posts"],
            data: {
              comment: comment,
              creatorId: currentUser.uid,
              timestamp: FirebaseTSApp.getFirestoreTimestamp(),
              likes: 0, // Initialize likes to zero
              likedBy: [] // Initialize likedBy as an empty array
            },
            onComplete: (docId) => {
              this.dialog.close();
            }
          });
        }
      }
    

      onPhotoSelected(photoSelector: HTMLInputElement) {
            if (photoSelector.files ) {
              this.selectedImageFile = photoSelector.files[0];
              const fileReader = new FileReader();
              fileReader.readAsDataURL(this.selectedImageFile);
              fileReader.addEventListener("loadend", ev => {
                const readableString = fileReader.result?.toString() || '';
                const postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement;
                if (postPreviewImage) {
                  postPreviewImage.src = readableString;
                }
              });
            }
          }
        }
        
