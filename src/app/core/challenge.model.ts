export type Primitive = number | boolean | string;
export type ChallengeId = 'balance' | 'payment' | 'categories';
export type PlayMode = 'guided' | 'code';
export type Screen = 'welcome' | 'playing' | 'victory';

export interface TestCase {
  readonly label: string;
  readonly args: Readonly<Record<string, Primitive>>;
  readonly expected: Primitive;
}

export interface GuidedChoice {
  readonly label: string;
  readonly expression: string;
}

export interface Challenge {
  readonly id: ChallengeId;
  readonly number: string;
  readonly title: string;
  readonly subtitle: string;
  readonly role: string;
  readonly icon: string;
  readonly headline: string;
  readonly narrative: string;
  readonly task: string;
  readonly signature: string;
  readonly functionName: string;
  readonly returnType: 'number' | 'boolean' | 'string';
  readonly starterExpression: string;
  readonly choices: readonly GuidedChoice[];
  readonly hints: readonly string[];
  readonly tests: readonly TestCase[];
  readonly whyItMatters: string;
}

export interface TestOutcome {
  readonly label: string;
  readonly passed: boolean;
  readonly expected: Primitive;
  readonly actual: Primitive | null;
  readonly error?: string;
}

export interface RunResult {
  readonly passed: boolean;
  readonly outcomes: readonly TestOutcome[];
  readonly error?: string;
}
