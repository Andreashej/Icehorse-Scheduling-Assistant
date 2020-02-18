import { Test } from './test.model';
import { TestBlock } from './testblock.model';

export class TestFull extends Test {
    blocks: TestBlock[];

    deserialize(input) {
        Object.assign(this, input);
        
        if (input && input.blocks) {
            this.blocks = input.blocks.map(block => new TestBlock().deserialize(block));
        }

        return this;
    }
}
