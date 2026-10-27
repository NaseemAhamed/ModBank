import { Injectable, computed, signal } from '@angular/core';
import { CHALLENGES, replaceReturnExpression, starterCode } from './challenges';
import { runChallenge } from './challenge-engine';
import type { ChallengeId, PlayMode, RunResult, Screen } from './challenge.model';

type CodeState = Record<ChallengeId, string>;
type ResultState = Partial<Record<ChallengeId, RunResult>>;
type HintState = Record<ChallengeId, number>;

function freshCodes(): CodeState {
  return {
    balance: starterCode(CHALLENGES[0]),
    payment: starterCode(CHALLENGES[1]),
    categories: starterCode(CHALLENGES[2])
  };
}
function freshHints(): HintState { return { balance: 0, payment: 0, categories: 0 }; }

@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly missions = CHALLENGES;
  readonly screen = signal<Screen>('welcome');
  readonly mode = signal<PlayMode>('guided');
  readonly activeIndex = signal(0);
  readonly unlockedIndex = signal(0);
  readonly codes = signal<CodeState>(freshCodes());
  readonly results = signal<ResultState>({});
  readonly completed = signal<readonly ChallengeId[]>([]);
  readonly hints = signal<HintState>(freshHints());
  readonly current = computed(() => this.missions[this.activeIndex()]);
  readonly currentCode = computed(() => this.codes()[this.current().id]);
  readonly currentResult = computed(() => this.results()[this.current().id] ?? null);
  readonly currentHintLevel = computed(() => this.hints()[this.current().id]);
  readonly missionPassed = computed(() => this.completed().includes(this.current().id));
  readonly completedCount = computed(() => this.completed().length);
  readonly progress = computed(() => Math.round((this.completedCount() / this.missions.length) * 100));

  start(mode: PlayMode): void { this.reset(); this.mode.set(mode); this.screen.set('playing'); }

  reset(): void {
    this.screen.set('welcome'); this.mode.set('guided'); this.activeIndex.set(0);
    this.unlockedIndex.set(0); this.codes.set(freshCodes()); this.results.set({});
    this.completed.set([]); this.hints.set(freshHints());
  }

  setCode(code: string): void {
    if (this.missionPassed()) return;
    const id = this.current().id;
    this.codes.update((value) => ({ ...value, [id]: code }));
    this.results.update((value) => ({ ...value, [id]: undefined }));
  }

  selectChoice(expression: string): void {
    this.setCode(replaceReturnExpression(this.current(), expression));
  }

  runTests(): void {
    const id = this.current().id;
    if (this.missionPassed()) return;
    const result = runChallenge(this.current(), this.currentCode());
    this.results.update((value) => ({ ...value, [id]: result }));
    if (result.passed) {
      this.completed.update((value) => value.includes(id) ? value : [...value, id]);
      this.unlockedIndex.update((value) => Math.min(this.missions.length - 1, Math.max(value, this.activeIndex() + 1)));
    }
  }

  revealHint(): void {
    const id = this.current().id;
    this.hints.update((value) => ({ ...value, [id]: Math.min(this.current().hints.length, value[id] + 1) }));
  }

  resetMission(): void {
    if (this.missionPassed()) return;
    const id = this.current().id;
    this.codes.update((value) => ({ ...value, [id]: starterCode(this.current()) }));
    this.results.update((value) => ({ ...value, [id]: undefined }));
    this.hints.update((value) => ({ ...value, [id]: 0 }));
  }

  selectMission(index: number): void {
    if (index >= 0 && index <= this.unlockedIndex() && index < this.missions.length) this.activeIndex.set(index);
  }

  next(): void {
    if (!this.missionPassed()) return;
    if (this.activeIndex() === this.missions.length - 1) this.screen.set('victory');
    else this.activeIndex.update((value) => value + 1);
  }
}
