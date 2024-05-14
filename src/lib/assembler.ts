import { operations } from './constants'
import { decode } from './encoding'

export function assemble (code: Array<string>) {
  const labels = {}
  return code
    // 1. Remove all empty lines
    .filter(line => line.length)
    // 2. Remove all tabs and spaces at the beginning of lines
    .map(line => line.trimStart().trimEnd())
    // 3. Replace & and # with push and operand
    .reduce(replaceInlineOperation(['&', '#'], 'push'), [])
    // 4. Replace . with load and operand
    .reduce(replaceInlineOperation(['.'], 'load'), [])
    // 5. Replace @ + rest of line with decoded tobaud
    .map(line => line.startsWith('@') ? String(decode(line.slice(1))[0]) : line)
    // 6. Store memory address of labels
    .map(storeLabels(labels))
    // 7. Remove labels
    .filter(line => line.endsWith(':'))
    // 8. Replace labels with their index
    .map(line => Object.keys(labels).includes(line) ? labels[line] : line)
    // 9. Replace mnemonics with their opcode
    .map(line => operations.includes(line) ? operations.indexOf(line) : line)
}

function replaceInlineOperation (prefixes: Array<string>, operation: string) {
  return function reduceFn (prev: Array<string>, line: string) {
    return prefixes.some(prefix => line.startsWith(prefix))
      ? [...prev, operation, line.slice(1)]
      : [...prev, line]
  }
}

function storeLabels(labels: Record<string, number>) {
  return function mapFn (line: string, lineIndex: number) {
    if (line.endsWith(':')) {
      const labelName = line.slice(0, -1)
      const labelCount = Object.keys(labels).length
      const address = lineIndex - labelCount
      if (labels[labelName] !== undefined) throw new Error(`Label '${labelName}' is defined twice.`);
      labels[labelName] = address
    }
    return line
  }
}
