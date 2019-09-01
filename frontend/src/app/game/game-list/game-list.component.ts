import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../game.model';

import { environment } from '../../../environments/environment';

import { faGithub, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  public games: Game[] = [];

  public faGithub = faGithub;
  public faLinux = faLinux;
  public faWindows = faWindows;

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.getAllRepos().subscribe(games => {
      this.games = games;
      for (const game of games) {
        console.log(game);
        if (game.download_links !== null) {
          for (const downloadLink of game.download_links) {
            downloadLink.link = `${environment.dlUrl}${downloadLink.link}`;
          }
        }
      }
    });
  }

}
