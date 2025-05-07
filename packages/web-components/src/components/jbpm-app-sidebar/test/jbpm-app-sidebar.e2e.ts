import { newE2EPage } from '@stencil/core/testing';

describe('jbpm-app-sidebar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<jbpm-app-sidebar></jbpm-app-sidebar>');

    const element = await page.find('jbpm-app-sidebar');
    expect(element).toHaveClass('hydrated');
  });
});
