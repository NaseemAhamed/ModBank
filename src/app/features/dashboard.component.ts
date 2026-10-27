import { Component, inject } from '@angular/core';
import { GameStateService } from '../core/game-state.service';

@Component({
  selector: 'app-dashboard', standalone: true,
  template: `
  <section class="monitor-card" aria-label="Live fictional banking dashboard">
    <div class="monitor-head"><div><span class="section-kicker">LIVE PREVIEW</span><h3>Your ModBank dashboard</h3></div><span class="live-tag"><span></span> SIMULATED</span></div>
    <div class="bank-card">
      <div class="bank-card-top"><span>MODBANK <span class="bank-card-mark">✳</span></span><span>•••• 2408</span></div>
      <div class="bank-card-label">Alex's balance</div>
      <div class="bank-card-balance">{{ game.completed().includes('balance') ? '£175.00' : '£130.00' }}</div>
      <div class="bank-card-foot">
        @if (game.completed().includes('balance')) { <span class="bank-state good">✓ CALCULATION FIXED</span> }
        @else { <span class="bank-state bad">⚠ DEPOSIT ERROR</span> }
        <span>VIRTUAL CARD</span>
      </div>
    </div>
    <div class="mini-status-grid">
      <div class="mini-status"><span>Payment safety</span><strong [class.status-good]="game.completed().includes('payment')" [class.status-bad]="!game.completed().includes('payment')">{{ game.completed().includes('payment') ? '✓ Protected' : '⚠ At risk' }}</strong></div>
      <div class="mini-status"><span>Reporting</span><strong [class.status-good]="game.completed().includes('categories')" [class.status-bad]="!game.completed().includes('categories')">{{ game.completed().includes('categories') ? '✓ Accurate' : '⚠ Incorrect' }}</strong></div>
    </div>
    <div class="transaction-heading"><h4>Recent transactions</h4><span>EXAMPLE DATA</span></div>
    <div class="transaction-list">
      <div class="transaction-row"><span class="transaction-avatar credit">↓</span><span class="transaction-info"><strong>Pocket money</strong><small>{{ game.completed().includes('categories') ? 'Income' : 'Expense ⚠' }}</small></span><span class="transaction-amount positive">+£30.00</span></div>
      <div class="transaction-row"><span class="transaction-avatar debit">↑</span><span class="transaction-info"><strong>Corner café</strong><small>{{ game.completed().includes('categories') ? 'Expense' : 'Income ⚠' }}</small></span><span class="transaction-amount">−£4.50</span></div>
      <div class="transaction-row"><span class="transaction-avatar credit">↓</span><span class="transaction-info"><strong>Refund</strong><small>{{ game.completed().includes('categories') ? 'Income' : 'Expense ⚠' }}</small></span><span class="transaction-amount positive">+£7.00</span></div>
    </div>
    <div class="monitor-note"><span>ⓘ</span> Fix a mission to see the bank update in real time.</div>
  </section>
  `
})
export class DashboardComponent { readonly game = inject(GameStateService); }
