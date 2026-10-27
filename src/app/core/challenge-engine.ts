import { compileSafeExpression } from './safe-expression';
import type { Challenge, Primitive, RunResult, TestOutcome } from './challenge.model';

export function extractReturnExpression(challenge: Challenge, code: string): string {
  if (code.length > 2000) throw new Error('Code is too long. This mission needs one small function.');
  // A fixed function wrapper ensures there are no extra statements, blocks or side effects.
  const match = /^\s*function\s+([A-Za-z_$][\w$]*)\s*\(\s*([^()]*)\s*\)\s*:\s*(number|boolean|string)\s*\{\s*return\s+([\s\S]*?)\s*;\s*\}\s*$/.exec(code);
  if (!match) throw new Error('Keep the function header and braces as they are. Change only the expression after return.');
  if (match[1] !== challenge.functionName || match[2].replace(/\s+/g, '') !== challenge.signature.replace(/\s+/g, '') || match[3] !== challenge.returnType) {
    throw new Error('Keep the function name, parameter types and return type unchanged.');
  }
  const expression = match[4].trim();
  if (!expression) throw new Error('You need to return a value.');
  return expression;
}

function compare(actual: Primitive, expected: Primitive): boolean {
  return typeof actual === typeof expected && (typeof actual === 'number' && typeof expected === 'number'
    ? Number.isFinite(actual) && Math.abs(actual - expected) < 0.000001
    : actual === expected);
}

export function runChallenge(challenge: Challenge, code: string): RunResult {
  try {
    const expression = extractReturnExpression(challenge, code);
    const names = challenge.signature.split(',').map((param) => param.trim().split(':')[0].trim());
    const evaluate = compileSafeExpression(expression, names);
    const outcomes: TestOutcome[] = challenge.tests.map((test) => {
      try {
        const actual = evaluate(test.args);
        if (typeof actual !== challenge.returnType) {
          return { label: test.label, passed: false, expected: test.expected, actual, error: `Expected a ${challenge.returnType} result.` };
        }
        return { label: test.label, passed: compare(actual, test.expected), expected: test.expected, actual };
      } catch (error) {
        return { label: test.label, passed: false, expected: test.expected, actual: null, error: getErrorMessage(error) };
      }
    });
    return { passed: outcomes.every((outcome) => outcome.passed), outcomes };
  } catch (error) {
    return { passed: false, outcomes: [], error: getErrorMessage(error) };
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'This expression could not be tested.';
}

export function formatValue(value: Primitive | null): string {
  if (value === null) return '—';
  if (typeof value === 'string') return `“${value}”`;
  if (typeof value === 'number') return Number(value.toFixed(6)).toString();
  return String(value);
}
