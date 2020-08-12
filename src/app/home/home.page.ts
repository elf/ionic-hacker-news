import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

import {ArticleSummary } from '../article-summary';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  articleIds: Array<number>;

  articleSummaries: ArticleSummary[] = [];

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
  ) {}

  async ionViewDidEnter() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();

    this.http.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json')
      .subscribe(articleIds_data => {
        this.articleIds = articleIds_data.slice(0,25);
        console.log(JSON.stringify(articleIds_data));
        for (const i in this.articleIds) {
          const article_id = this.articleIds[i];
          const url = `https://hacker-news.firebaseio.com/v0/item/${article_id}.json`;
          this.http.get<ArticleSummary>(url)
          .subscribe(article_summary_data => {
            this.articleSummaries[i] = article_summary_data;
            });
        }
        console.log(JSON.stringify(this.articleSummaries));
        loading.dismiss();
      });
  }
}

