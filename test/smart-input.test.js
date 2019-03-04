import { html, fixture, expect } from '@open-wc/testing';

import '../src/smart-input';

describe('<smart-input>', () => {
  it('has a default property header', async () => {
    const el = await fixture('<smart-input></smart-input>');
    expect(el.title).to.equal('open-wc');
  });

  it('allows property header to be overwritten', async () => {
    const el = await fixture(html`
      <smart-input title="different"></smart-input>
    `);
    expect(el.title).to.equal('different');
  });
});
