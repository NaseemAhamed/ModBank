import type { Challenge, ChallengeId } from './challenge.model';

export const CHALLENGES: readonly Challenge[] = [
  {
    id: 'balance', number: '01', title: 'The missing money',
    subtitle: 'Balance calculations', role: 'Software engineer', icon: 'wallet',
    headline: 'Where did the £45 go?',
    narrative: 'Alex had £125 in ModBank and deposited £50. The account now says £130. That can’t be right!',
    task: 'Fix the RETURN expression so every deposit is added in full. Change only the expression after return.',
    signature: 'balance: number, deposit: number', functionName: 'addDeposit', returnType: 'number',
    starterExpression: 'balance + deposit / 10',
    choices: [
      { label: 'Add the full deposit', expression: 'balance + deposit' },
      { label: 'Subtract the deposit', expression: 'balance - deposit' },
      { label: 'Add one tenth of the deposit', expression: 'balance + deposit / 10' }
    ],
    hints: [
      'A deposit should make the balance go up by exactly that amount.',
      'You need addition, but not division. The original code divides by 10.'
    ],
    tests: [
      { label: '£125 + £50 deposit', args: { balance: 125, deposit: 50 }, expected: 175 },
      { label: '£80 + £20 deposit', args: { balance: 80, deposit: 20 }, expected: 100 },
      { label: '£0 + £5 deposit', args: { balance: 0, deposit: 5 }, expected: 5 },
      { label: '£19.50 + £0.50 deposit', args: { balance: 19.5, deposit: 0.5 }, expected: 20 }
    ],
    whyItMatters: 'Engineers test calculations carefully because even tiny money mistakes matter.'
  },
  {
    id: 'payment', number: '02', title: 'The double payment',
    subtitle: 'Payment protection', role: 'Payments engineer', icon: 'card',
    headline: 'One click. Two charges?',
    narrative: 'Sam buys cinema tickets. A payment retry arrives with the same reference. The bank must not charge Sam twice.',
    task: 'Fix the RETURN expression. A payment should go through only when it has NOT already been processed.',
    signature: 'alreadyProcessed: boolean', functionName: 'shouldProcessPayment', returnType: 'boolean',
    starterExpression: 'alreadyProcessed',
    choices: [
      { label: 'Only process a new payment', expression: '!alreadyProcessed' },
      { label: 'Only process an existing payment', expression: 'alreadyProcessed' },
      { label: 'Always process a payment', expression: 'true' }
    ],
    hints: [
      'The input alreadyProcessed tells you if the reference has been seen before.',
      'The ! operator means NOT. It reverses true and false.'
    ],
    tests: [
      { label: 'New payment should be accepted', args: { alreadyProcessed: false }, expected: true },
      { label: 'Repeated payment should be blocked', args: { alreadyProcessed: true }, expected: false },
      { label: 'Another new payment should be accepted', args: { alreadyProcessed: false }, expected: true },
      { label: 'Another retry should be blocked', args: { alreadyProcessed: true }, expected: false }
    ],
    whyItMatters: 'Payments engineers design idempotent systems so retries do not accidentally create duplicate charges.'
  },
  {
    id: 'categories', number: '03', title: 'The upside-down dashboard',
    subtitle: 'Transaction insights', role: 'Data engineer', icon: 'chart',
    headline: 'Income looks like spending!',
    narrative: 'Incoming pocket money is shown as an expense, and a café purchase looks like income. The chart is upside down.',
    task: 'Fix the RETURN expression so positive amounts are income and negative amounts are expenses.',
    signature: 'amount: number', functionName: 'categoryFor', returnType: 'string',
    starterExpression: "amount > 0 ? 'expense' : 'income'",
    choices: [
      { label: 'Positive amounts are income', expression: "amount > 0 ? 'income' : 'expense'" },
      { label: 'Positive amounts are expenses', expression: "amount > 0 ? 'expense' : 'income'" },
      { label: 'Everything is income', expression: "'income'" }
    ],
    hints: [
      'A positive amount means money has arrived. A negative amount means money has left.',
      'A ternary uses condition ? resultIfTrue : resultIfFalse. Swap the two labels.'
    ],
    tests: [
      { label: '+£30 pocket money', args: { amount: 30 }, expected: 'income' },
      { label: '-£4.50 café payment', args: { amount: -4.5 }, expected: 'expense' },
      { label: '+£7 refund', args: { amount: 7 }, expected: 'income' },
      { label: '-£12 cinema', args: { amount: -12 }, expected: 'expense' }
    ],
    whyItMatters: 'Data engineers make sure reporting and insights reflect what really happened.'
  }
] as const;

export function starterCode(challenge: Challenge): string {
  return `function ${challenge.functionName}(${challenge.signature}): ${challenge.returnType} {\n  return ${challenge.starterExpression};\n}`;
}

export function replaceReturnExpression(challenge: Challenge, expression: string): string {
  return `function ${challenge.functionName}(${challenge.signature}): ${challenge.returnType} {\n  return ${expression};\n}`;
}

export function challengeById(id: ChallengeId): Challenge {
  const match = CHALLENGES.find((challenge) => challenge.id === id);
  if (!match) throw new Error('Unknown challenge.');
  return match;
}
