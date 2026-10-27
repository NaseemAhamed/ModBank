import { Component, inject } from '@angular/core';
import { GameStateService } from '../core/game-state.service';

@Component({
  selector: 'app-victory', standalone: true,
  template: `
    <main class="victory-screen">
      <div class="victory-sparkle spark-left">✳</div><div class="victory-sparkle spark-right">✦</div>
      <div class="victory-trophy">🏆</div>
      <div class="victory-eyebrow">MISSION COMPLETE • ALL SYSTEMS GO</div>
      <h1>YOU SAVED <span class="gradient-text">MODBANK!</span></h1>
      <p class="victory-description">You did it. Three bugs fixed, four tests passed per mission, and a whole digital bank back on track.</p>
      <div class="victory-score"><strong>300</strong><span>TOTAL XP</span></div>
      <div class="victory-badges">
        <div class="victory-badge"><span>🧮</span><strong>Bug hunter</strong><small>Software engineer</small></div>
        <div class="victory-badge"><span>💳</span><strong>Payment protector</strong><small>Payments engineer</small></div>
        <div class="victory-badge"><span>📊</span><strong>Data detective</strong><small>Data engineer</small></div>
      </div>
      <div class="career-panel"><span class="career-icon">✦</span><div><strong>That was real engineering thinking.</strong><p>Engineers at FinTech companies investigate bugs, write safe payment logic, and check that financial data is accurate. You just tried all three.</p></div></div>
      <button type="button" class="primary-button victory-restart" (click)="game.reset()">↻ NEW PLAYER — START AGAIN</button>
      <div class="victory-note">NO PERSONAL DATA SAVED • ALL MONEY WAS FICTIONAL</div>
    </main>
  `
})
export class VictoryComponent { readonly game = inject(GameStateService); }
