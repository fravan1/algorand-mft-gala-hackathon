import { Contract } from '@algorandfoundation/algorand-typescript'

export class Test extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
