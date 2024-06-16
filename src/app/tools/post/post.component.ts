import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postData!: PostData;
  creatorName!: string;
  creatorDescription!: string;
  isLiked: boolean = false;
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCreatorInfo();
    this.checkIfUserLiked();
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData.postId });
  }

 
  onLikeClick() {
    const userId = this.auth.getAuth().currentUser?.uid;
    if (!userId) {
      console.error("User is not authenticated.");
      return;
    }

    const likedBy = this.postData.likedBy || [];

    if (this.isLiked) {
      // Unlike
      const index = likedBy.indexOf(userId);
      if (index > -1) {
        likedBy.splice(index, 1);
      }
    } else {
      // Like
      likedBy.push(userId);
    }

    const newLikesCount = likedBy.length;

    this.firestore.update({
      path: ["Posts", this.postData.postId],
      data: {
        likes: newLikesCount,
        likedBy: likedBy
      },
      onComplete: () => {
        this.postData.likes = newLikesCount;
        this.postData.likedBy = likedBy;
        this.isLiked = !this.isLiked;
      },
      onFail: (err) => {
        console.error("Failed to update likes:", err);
      }
    });
  }

  checkIfUserLiked() {
    const userId = this.auth.getAuth().currentUser?.uid;
    if (userId && this.postData.likedBy && this.postData.likedBy.includes(userId)) {
      this.isLiked = true;
    }
  }


  getCreatorInfo() {
    this.firestore.getDocument({
      path: ["Users", this.postData.creatorId],
      onComplete: result => {
        const userDocument = result.data();
        if (userDocument) {
          this.creatorName = userDocument['publicName'];
          this.creatorDescription = userDocument['description'];
        } else {
          console.error('User document not found');
        }
      },
      onFail: err => {
        console.error('Failed to get document:', err);
      }
    });
  }
}
