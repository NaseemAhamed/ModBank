import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { CodeEditorComponent } from '../shared/code-editor.component';
import { GameStateService } from '../core/game-state.service';
import { formatValue, extractReturnExpression } from '../core/challenge-engine';
import { DashboardComponent } from './dashboard.component';

@Component({
  selector: 'app-mission', standalone: true, imports: [CodeEditorComponent, DashboardComponent, UpperCasePipe],
  template: `
  <main class="play-layout">
    <nav class="mission-sidebar" aria-label="Challenge missions">
      <div class="sidebar-top"><span class="section-kicker">YOUR MISSION</span><h2>Fix the bank<span>.</span></h2><p>Repair 3 bugs to save the launch.</p></div>
      <div class="sidebar-progress"><div class="progress-label"><span>MISSION PROGRESS</span><b>{{ game.completedCount() }}/3</b></div><div class="progress-track"><div class="progress-fill" [style.width.%]="game.progress()"></div></div></div>
      <div class="mission-nav-list">
        @for (mission of game.missions; track mission.id; let index = $index) {
          <button type="button" class="mission-nav-button" [class.active]="game.activeIndex() === index" [class.done]="game.completed().includes(mission.id)" [disabled]="index > game.unlockedIndex()" (click)="game.selectMission(index)" [attr.aria-current]="game.activeIndex() === index ? 'step' : null">
            <span class="mission-nav-number">{{ game.completed().includes(mission.id) ? '✓' : mission.number }}</span>
            <span class="mission-nav-copy"><strong>{{ mission.title }}</strong><small>{{ mission.subtitle }}</small></span>
            <span class="mission-nav-arrow">{{ index > game.unlockedIndex() ? '🔒' : '›' }}</span>
          </button>
        }
      </div>
      <div class="sidebar-help"><span class="help-emoji">💡</span><div><strong>Stuck? That's normal.</strong><p>Real engineers use hints, test their ideas, and try again.</p></div></div>
      <div class="sidebar-footer">MODBANK ENGINEERING LAB<br><span>POWERED BY CURIOSITY ✳</span></div>
    </nav>
    <section class="play-content">
      <div class="play-content-top"><div class="breadcrumb">CHALLENGES <span>/</span> MISSION {{ game.current().number }}</div><span class="mode-indicator">{{ game.mode() === 'guided' ? '✳ GUIDED MODE' : '⌘ CODE MODE' }}</span></div>
      <div class="workspace-grid">
        <div class="mission-workspace">
          <div class="mission-heading"><div class="mission-level">LEVEL {{ game.current().number }} <span>•</span> {{ game.current().role | uppercase }}</div><h1>{{ game.current().headline }}</h1><p>{{ game.current().narrative }}</p></div>
          <div class="challenge-callout"><span class="callout-icon">↳</span><span><strong>YOUR TASK</strong><br>{{ game.current().task }}</span></div>
          <div class="code-panel">
            <div class="code-panel-header"><div><span class="three-dots"><i></i><i></i><i></i></span><span>{{ game.current().functionName }}.ts</span></div><span>TypeScript</span></div>
            <app-code-editor [code]="game.currentCode()" [readOnly]="game.mode() === 'guided' || game.missionPassed()" (codeChange)="game.setCode($event)" />
          </div>
          @if (game.mode() === 'guided' && !game.missionPassed()) {
            <div class="guided-choice-section"><span class="section-kicker">PICK A FIX</span><p>Choose what you think the function should return:</p>
              <div class="choice-list">
                @for (choice of game.current().choices; track choice.expression; let i = $index) {
                  <button type="button" class="choice-button" [class.picked]="selectedExpression() === choice.expression" (click)="game.selectChoice(choice.expression)"><span class="choice-letter">{{ ['A','B','C'][i] }}</span><span>{{ choice.label }}</span><span class="choice-radio"></span></button>
                }
              </div>
            </div>
          }
          <div class="actions-row">
            @if (!game.missionPassed()) {
              <button type="button" class="primary-button run-button" (click)="game.runTests()">▶ &nbsp; RUN TESTS</button>
              <button type="button" class="quiet-button" (click)="game.revealHint()" [disabled]="game.currentHintLevel() >= game.current().hints.length">💡 Hint {{ game.currentHintLevel() > 0 ? game.currentHintLevel() + '/' + game.current().hints.length : '' }}</button>
              <button type="button" class="quiet-button" (click)="game.resetMission()">↻ Reset code</button>
            } @else {
              <button type="button" class="primary-button next-button" (click)="game.next()">{{ game.activeIndex() === 2 ? 'SEE YOUR RESULTS' : 'NEXT MISSION' }} <span>↗</span></button>
            }
          </div>
          @if (game.currentHintLevel() > 0 && !game.missionPassed()) {
            <div class="hint-box"><strong>💡 HINT {{ game.currentHintLevel() }}</strong><p>{{ game.current().hints[game.currentHintLevel() - 1] }}</p></div>
          }
          @if (game.currentResult(); as result) {
            <div class="test-panel" [class.test-success]="result.passed" role="status" aria-live="polite">
              <div class="test-title"><span>{{ result.passed ? '✓' : '⚠' }}</span><strong>{{ result.passed ? 'All tests passed. Nicely done!' : (result.error ? 'Check your code' : 'Not quite — keep going!') }}</strong></div>
              @if (result.error) { <p class="test-error">{{ result.error }}</p> }
              @for (outcome of result.outcomes; track outcome.label) {
                <div class="test-line"><span [class.passed-dot]="outcome.passed" [class.failed-dot]="!outcome.passed">{{ outcome.passed ? '✓' : '×' }}</span><span class="test-case-title">{{ outcome.label }}</span><span class="test-case-result">{{ outcome.passed ? 'PASS' : 'Expected ' + display(outcome.expected) + ', got ' + (outcome.error ?? display(outcome.actual)) }}</span></div>
              }
              @if (result.passed) { <p class="why-matters">✦ {{ game.current().whyItMatters }}</p> }
            </div>
          }
        </div>
        <app-dashboard />
      </div>
    </section>
  </main>
  `
})
export class MissionComponent {
  readonly game = inject(GameStateService);
  readonly display = formatValue;
  selectedExpression(): string | null {
    try { return extractReturnExpression(this.game.current(), this.game.currentCode()); }
    catch { return null; }
  }
}
