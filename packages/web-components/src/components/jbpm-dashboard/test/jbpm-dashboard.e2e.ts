import { newE2EPage } from '@stencil/core/testing';

describe('jbpm-dashboard', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<jbpm-dashboard></jbpm-dashboard>');

    const element = await page.find('jbpm-dashboard');
    expect(element).toHaveClass('hydrated');
  });
});
