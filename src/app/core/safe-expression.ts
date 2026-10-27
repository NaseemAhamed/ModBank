/**
 * Tiny, deliberately restricted expression interpreter for the event.
 * No eval, Function, dynamic imports, property access, indexing, loops or calls.
 * Students fix a single return expression inside a fixed TypeScript function.
 * This is not a general TypeScript or JavaScript runtime.
 */
import type { Primitive } from './challenge.model';

type Scope = Readonly<Record<string, Primitive>>;
type Evaluator = (scope: Scope) => Primitive;
interface Token { type: 'number' | 'string' | 'identifier' | 'operator' | 'end'; value: string; }

const MAX_SOURCE_LENGTH = 500;
const MAX_TOKENS = 120;
const OPERATORS = ['===', '!==', '>=', '<=', '&&', '||', '==', '!=', '+', '-', '*', '/', '>', '<', '!', '?', ':', '(', ')'];
const PRECEDENCE: Readonly<Record<string, number>> = { '||': 1, '&&': 2, '===': 3, '!==': 3, '==': 3, '!=': 3, '>': 4, '>=': 4, '<': 4, '<=': 4, '+': 5, '-': 5, '*': 6, '/': 6 };

function tokenize(source: string): Token[] {
  if (source.length > MAX_SOURCE_LENGTH) throw new Error('Expression is too long. Keep your fix simple.');
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    if (/\s/.test(source[i])) { i++; continue; }
    if (tokens.length >= MAX_TOKENS) throw new Error('Too many pieces in the expression.');
    const rest = source.slice(i);
    const numberMatch = /^(?:\d+(?:\.\d+)?|\.\d+)/.exec(rest);
    if (numberMatch) {
      tokens.push({ type: 'number', value: numberMatch[0] }); i += numberMatch[0].length; continue;
    }
    if (source[i] === "'" || source[i] === '"') {
      const quote = source[i]; let value = ''; let closed = false; i++;
      while (i < source.length) {
        const ch = source[i++];
        if (ch === quote) { closed = true; break; }
        if (ch === '\\') {
          if (i >= source.length) throw new Error('Unfinished escape in a string.');
          const escaped = source[i++];
          if (escaped !== quote && escaped !== '\\') throw new Error('Only escaped quotes and backslashes are supported.');
          value += escaped;
        } else { value += ch; }
      }
      if (!closed) throw new Error('A string is missing its closing quote.');
      tokens.push({ type: 'string', value }); continue;
    }
    const identifierMatch = /^[a-zA-Z_$][a-zA-Z\d_$]*/.exec(rest);
    if (identifierMatch) {
      tokens.push({ type: 'identifier', value: identifierMatch[0] }); i += identifierMatch[0].length; continue;
    }
    const op = OPERATORS.find((candidate) => rest.startsWith(candidate));
    if (!op) throw new Error(`Unsupported character: ${JSON.stringify(source[i])}. Edit only the return expression.`);
    tokens.push({ type: 'operator', value: op }); i += op.length;
  }
  tokens.push({ type: 'end', value: '' });
  return tokens;
}

function numeric(value: Primitive): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Expected a valid number in the calculation.');
  return value;
}
function boolean(value: Primitive): boolean {
  if (typeof value !== 'boolean') throw new Error('Expected true or false.');
  return value;
}

export function compileSafeExpression(source: string, allowedIdentifiers: readonly string[]): Evaluator {
  const tokens = tokenize(source);
  let cursor = 0;
  const next = (): Token => tokens[cursor] ?? { type: 'end', value: '' };
  const take = (): Token => tokens[cursor++] ?? { type: 'end', value: '' };
  const consume = (value: string): boolean => {
    if (next().value === value) { take(); return true; }
    return false;
  };
  const expect = (value: string): void => {
    if (!consume(value)) throw new Error(`Expected "${value}" in the expression.`);
  };

  const parsePrimary = (): Evaluator => {
    const token = take();
    if (token.type === 'number') {
      const number = Number(token.value);
      if (!Number.isFinite(number)) throw new Error('Invalid number.');
      return () => number;
    }
    if (token.type === 'string') return () => token.value;
    if (token.type === 'identifier') {
      if (token.value === 'true') return () => true;
      if (token.value === 'false') return () => false;
      if (!allowedIdentifiers.includes(token.value)) throw new Error(`"${token.value}" is not a known input. Check the function parameters.`);
      return (scope) => {
        const value = scope[token.value];
        if (value === undefined) throw new Error('Missing input.');
        return value;
      };
    }
    if (token.value === '(') {
      const expr = parseConditional();
      expect(')'); return expr;
    }
    throw new Error('Incomplete expression. Check the code after return.');
  };

  const parseUnary = (): Evaluator => {
    if (consume('!')) { const right = parseUnary(); return (scope) => !boolean(right(scope)); }
    if (consume('-')) { const right = parseUnary(); return (scope) => -numeric(right(scope)); }
    if (consume('+')) { const right = parseUnary(); return (scope) => numeric(right(scope)); }
    return parsePrimary();
  };

  const binary = (op: string, left: Evaluator, right: Evaluator): Evaluator => {
    if (op === '&&') return (scope) => boolean(left(scope)) && boolean(right(scope));
    if (op === '||') return (scope) => boolean(left(scope)) || boolean(right(scope));
    return (scope) => {
      const a = left(scope); const b = right(scope);
      switch (op) {
        case '+': return numeric(a) + numeric(b);
        case '-': return numeric(a) - numeric(b);
        case '*': return numeric(a) * numeric(b);
        case '/': {
          const divisor = numeric(b);
          if (divisor === 0) throw new Error('Cannot divide by zero.');
          return numeric(a) / divisor;
        }
        case '>': return numeric(a) > numeric(b);
        case '<': return numeric(a) < numeric(b);
        case '>=': return numeric(a) >= numeric(b);
        case '<=': return numeric(a) <= numeric(b);
        case '===': case '==': return a === b;
        case '!==': case '!=': return a !== b;
        default: throw new Error('Unsupported operator.');
      }
    };
  };

  const parseBinary = (minimum = 1): Evaluator => {
    let left = parseUnary();
    while (true) {
      const op = next().value;
      const precedence = PRECEDENCE[op] ?? 0;
      if (precedence < minimum) break;
      take(); const right = parseBinary(precedence + 1);
      left = binary(op, left, right);
    }
    return left;
  };

  function parseConditional(): Evaluator {
    const condition = parseBinary();
    if (!consume('?')) return condition;
    const whenTrue = parseConditional();
    expect(':');
    const whenFalse = parseConditional();
    return (scope) => boolean(condition(scope)) ? whenTrue(scope) : whenFalse(scope);
  }

  const evaluator = parseConditional();
  if (next().type !== 'end') throw new Error('Unexpected code after the expression. Use a single return expression.');
  return evaluator;
}
