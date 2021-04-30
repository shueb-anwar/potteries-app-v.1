import { MilitaryTimePipe } from './military-time.pipe';

describe('MilitaryTimePipe', () => {
  it('create an instance', () => {
    const pipe = new MilitaryTimePipe();
    expect(pipe).toBeTruthy();
  });
});
