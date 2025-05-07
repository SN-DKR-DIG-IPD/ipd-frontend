import { newE2EPage } from '@stencil/core/testing';

describe('jbpm-login-test', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<jbpm-login-test></jbpm-login-test>');

    const element = await page.find('jbpm-login-test');
    expect(element).toHaveClass('hydrated');
  });
});
