import { operations } from './constants'

export type TokenType = 'label' | 'const' | 'ptr' | 'deref' | 'char' | 'op'

export interface Token {
  type: TokenType,
  lexeme: string,
  value: number | string
}

class SyntaxError extends Error {
  constructor(message: string, line: number, str: string) {
    super(`Line ${line}: '${str}'. ${message}`)
    this.name = "ValidationError"
  }
}

export function tokenize (code: string): Array<Token> {
  return code
    .split('\n')
    .filter(line => line.length)
    .map(line => line.trimStart().trimEnd())
    .map((line, idx): Token => {
      console.log(line)
      if (line.endsWith(':')) {
        if (!isValidLabel(line.slice(0, -1))) throw new SyntaxError(`Not a valid label`, idx, line)
        return { type: 'label', lexeme: line, value: line.slice(0, -1) }
      }
      if (line.startsWith('#')) {
        if (!isValidConst(line.slice(1))) throw new SyntaxError(`Not a valid const`, idx, line)
        return { type: 'const', lexeme: line, value: Number(line.slice(1)) }
      }
      if (line.startsWith('&')) {
        if (!isValidLabel(line.slice(1))) throw new SyntaxError(`Not a valid ptr`, idx, line)
        return { type: 'ptr', lexeme: line, value: line.slice(1) }
      }
      if (line.startsWith('*')) {
        if (!isValidLabel(line.slice(1))) throw new SyntaxError(`Not a valid deref`, idx, line)
        return { type: 'deref', lexeme: line, value: line.slice(1) }
      }
      if (line.startsWith('@')) {
        if (!isValidChar(line.slice(1))) throw new SyntaxError(`Not a valid char`, idx, line)
        return { type: 'char', lexeme: line, value: line.slice(1) }
      }
      if (operations.includes(line)) return { type: 'op', lexeme: line, value: operations.indexOf(line) }

      throw new SyntaxError(`Illegal expression`, idx, line)
    });
}

function isValidLabel (str: string) {
  return /[a-z]/.test(str)
}

function isValidConst(str: string) {
  return /^[0-9]{1,2}$/.test(str) && Number(str) < 32
}

function isValidChar(str: string) {
  return /^[a-z0-5\ ]{1}$/.test(str)
}