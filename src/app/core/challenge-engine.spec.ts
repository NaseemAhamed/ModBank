import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES, replaceReturnExpression, starterCode } from './challenges';
import { compileSafeExpression } from './safe-expression';
import { extractReturnExpression, runChallenge } from './challenge-engine';

test('all three starter missions are broken', () => {
  for (const challenge of CHALLENGES) {
    const result = runChallenge(challenge, starterCode(challenge));
    assert.equal(result.passed, false, challenge.id);
    assert.ok(result.outcomes.some((outcome) => !outcome.passed));
  }
});

test('all three correct patches pass their four tests', () => {
  for (const challenge of CHALLENGES) {
    const fixed = replaceReturnExpression(challenge, challenge.choices[0].expression);
    const result = runChallenge(challenge, fixed);
    assert.equal(result.passed, true, challenge.id + ': ' + JSON.stringify(result));
    assert.equal(result.outcomes.length, 4);
  }
});

test('unsafe statements and function calls are rejected', () => {
  const challenge = CHALLENGES[0];
  const candidates = [
    'balance + deposit; console.log(1)',
    'fetch("https://example.com")',
    'balance.constructor',
    'globalThis',
    'balance + (deposit * 2); throw new Error("x")'
  ];
  for (const expression of candidates) {
    const result = runChallenge(challenge, replaceReturnExpression(challenge, expression));
    assert.equal(result.passed, false, expression);
  }
});

test('function header cannot be modified', () => {
  const challenge = CHALLENGES[0];
  assert.throws(() => extractReturnExpression(challenge, 'function wrong(balance: number, deposit: number): number { return balance + deposit; }'));
});

test('ternary, logical negation and parentheses work', () => {
  assert.equal(compileSafeExpression('amount > 0 ? "income" : "expense"', ['amount'])({ amount: 9 }), 'income');
  assert.equal(compileSafeExpression('!alreadyProcessed', ['alreadyProcessed'])({ alreadyProcessed: true }), false);
  assert.equal(compileSafeExpression('balance + (deposit * 2)', ['balance', 'deposit'])({ balance: 5, deposit: 3 }), 11);
});

test('unknown names, divide by zero and runaway inputs are handled', () => {
  assert.throws(() => compileSafeExpression('unknown', ['amount']));
  assert.throws(() => compileSafeExpression('1 / 0', [])({}));
  assert.throws(() => compileSafeExpression('1 + '.repeat(600), []));
});

test('different valid solutions are accepted based on behaviour', () => {
  const validAlternatives = [
    '(balance + deposit)',
    'alreadyProcessed === false',
    "amount < 0 ? 'expense' : 'income'"
  ];
  CHALLENGES.forEach((challenge, i) => {
    const result = runChallenge(challenge, replaceReturnExpression(challenge, validAlternatives[i]));
    assert.equal(result.passed, true, challenge.id + ' alternate');
  });
});
