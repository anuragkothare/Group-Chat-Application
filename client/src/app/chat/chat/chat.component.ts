import { Component, OnInit, Inject, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatDialogConfig, MatListItem, MAT_DIALOG_DATA } from '@angular/material';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Message } from '../../Models/Message';
import { SocketService } from '../../services/socket/socket.service'
import { Observable } from 'rxjs';
import { ChatRoom } from 'src/app/Models/Chat-Room';

export interface DialogData {
  username: string;
  name: string;
}



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  username: string;
  name: string;

  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;


  constructor(public dialog: MatDialog, private router: Router, private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.verifyUser();
    this.socketService.getAllRooms().subscribe((chatRoomArray: ChatRoom[]) => {
      console.log("Rooms calling")
      console.log(chatRoomArray)
      this.chatRooms = chatRoomArray;
    })
  }
  public chatRooms: ChatRoom[] = [];
  public messages: any[] = ["Rev", "OPPP", "KROOS", "BENZEMA"]

  openDialog(): void {
    // const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //   height: '300px',
    //   width:  '500px',
    //   data: {name: this.name, username: this.username}
    // });

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.height = '300px';
    dialogConfig.width = '500px';

    // this.dialog.open(DialogOverviewExampleDialog, dialogConfig);

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (roomName: String) => {
        console.log("Dialog output:", roomName)
        this.socketService.createRoom(roomName);
      });
  }

  public joinRoom(roomId: String) {
    console.log("CLicked on roomId: " +  roomId);
    this.socketService.joinRoom(roomId, (error,messages)=>{
      if(error){
        return;
      }
      console.log("Check Messages: "+ JSON.stringify(messages))
    })
  }

  
 
  





  // dialogRef.afterClosed().subscribe(result => {
  //   console.log('The dialog was closed');
  //   this.username = result;
  // });
}





@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  chatRoomName: String;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }



  

}