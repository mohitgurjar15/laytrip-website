import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  transaction_token: string;
  uuid: string;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.transaction_token = this.route.snapshot.queryParamMap.get('transaction_token');
    // console.log(this.uuid, this.transaction_token);
    this.bookFlight();
  }

  bookFlight() {
    let bookingData = {
      uuid: this.uuid,
      transaction_token: this.transaction_token
    };

    this.bookService.bookFlight(bookingData).subscribe((res: any) => {
      if (res.status == 'complete') {
        console.log(res);
        this.router.navigate(['/book/confirmation'])
      } else {
        this.router.navigate(['/book/failure'])
      }
    });
  }
}
