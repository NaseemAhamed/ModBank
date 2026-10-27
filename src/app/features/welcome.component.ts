import { Component, inject, signal } from '@angular/core';
import { GameStateService } from '../core/game-state.service';
import type { PlayMode } from '../core/challenge.model';

@Component({
  selector: 'app-welcome', standalone: true,
  template: `
  <main class="welcome-layout">
    <section class="hero-copy">
      <div class="eyebrow"><span class="sparkle">✦</span> THE FINTECH FIX-IT CHALLENGE</div>
      <h1>THE BANK IS <span class="gradient-text">BROKEN.</span><br>YOU'RE THE FIX.</h1>
      <p class="hero-description">Three bugs. One digital bank. Your mission: rescue the payments, fix the money, and launch ModBank. No experience needed.</p>
      <div class="hero-chips"><span>✦ 3 mini missions</span><span>◷ 5–10 minutes</span><span>✓ No sign-up</span></div>
      <div class="start-panel">
        <div class="panel-heading"><span class="section-kicker">CHOOSE YOUR PLAY STYLE</span><span class="tiny-pill">YOU CAN DO THIS</span></div>
        <div class="mode-grid" role="group" aria-label="Select challenge mode">
          <button type="button" class="mode-card" [class.selected]="selectedMode() === 'guided'" [attr.aria-pressed]="selectedMode() === 'guided'" (click)="selectedMode.set('guided')">
            <span class="mode-icon">✳</span><span class="mode-card-title">Guided mode</span>
            <span class="mode-card-info">Pick the right fix from a few choices. Great for first-timers.</span>
            <span class="mode-tag">BEGINNER FRIENDLY</span>
          </button>
          <button type="button" class="mode-card" [class.selected]="selectedMode() === 'code'" [attr.aria-pressed]="selectedMode() === 'code'" (click)="selectedMode.set('code')">
            <span class="mode-icon">⌘</span><span class="mode-card-title">Code mode</span>
            <span class="mode-card-info">Edit real TypeScript expressions and run the tests.</span>
            <span class="mode-tag">TRY YOUR SKILLS</span>
          </button>
        </div>
        <button type="button" class="primary-button start-button" (click)="game.start(selectedMode())">START THE MISSION <span aria-hidden="true">↗</span></button>
        <p class="fine-print">Everything here is pretend money. There's no account, login or real payment.</p>
      </div>
    </section>
    <aside class="hero-art" aria-label="Illustration of a digital bank that needs fixing">
      <div class="floating-star one">✳</div><div class="floating-star two">✦</div>
      <div class="mock-bank-card">
        <div class="mock-bank-top"><span class="mock-logo">M<span class="mock-logo-dot">.</span></span><span class="mock-online"><span></span> LIVE SYSTEM</span></div>
        <div class="mock-hello">Hello, Alex 👋</div>
        <div class="mock-subtitle">Your available balance</div>
        <div class="mock-balance">£130<span>.00</span> <small>⚠</small></div>
        <div class="mock-error">⚠ Something doesn't add up...</div>
        <div class="mock-divider"></div>
        <div class="mock-transaction"><div class="mock-avatar green">↘</div><div><strong>Cash deposit</strong><small>Just now</small></div><b>+£50.00</b></div>
        <div class="mock-transaction"><div class="mock-avatar blue">◎</div><div><strong>Cinema tickets</strong><small>Yesterday</small></div><b>−£12.00</b></div>
        <div class="mock-bug-sticker"><span>✳</span> 3 BUGS FOUND</div>
      </div>
      <div class="hero-art-note">CAN YOU SAVE THE DAY? <span>↗</span></div>
    </aside>
  </main>
  `
})
export class WelcomeComponent {
  readonly game = inject(GameStateService);
  readonly selectedMode = signal<PlayMode>('guided');
}
