import { Component, inject } from '@angular/core';
import { WelcomeComponent } from './features/welcome.component';
import { MissionComponent } from './features/mission.component';
import { VictoryComponent } from './features/victory.component';
import { GameStateService } from './core/game-state.service';

@Component({
  selector: 'app-root', standalone: true,
  imports: [WelcomeComponent, MissionComponent, VictoryComponent],
  template: `
    <div class="app-shell">
      <header class="site-header">
        <div class="brand-block"><span class="brand-emblem">M<span>.</span></span><span class="brand-text">MODBANK <small>ENGINEERING LAB</small></span></div>
        <div class="header-right"><span class="header-occasion">A FINTECH CAREERS EXPERIENCE</span><span class="header-separator"></span>
        @if (game.screen() !== 'welcome') { <button type="button" class="reset-visitor" (click)="game.reset()">↻ &nbsp; New visitor</button> }
        @else { <span class="header-pill"><span></span> READY TO PLAY</span> }
        </div>
      </header>
      @switch (game.screen()) {
        @case ('welcome') { <app-welcome /> }
        @case ('playing') { <app-mission /> }
        @case ('victory') { <app-victory /> }
      }
      <footer class="site-footer"><span>MODBANK <span class="footer-accent">✳</span> MADE FOR FUTURE ENGINEERS</span><span>SIMULATED FINTECH EXPERIENCE • NOT A REAL BANK</span></footer>
    </div>
  `
})
export class AppComponent { readonly game = inject(GameStateService); }
