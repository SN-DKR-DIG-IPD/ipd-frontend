import { newSpecPage } from '@stencil/core/testing';
import { JbpmLoginTest } from '../jbpm-login-test';

describe('jbpm-login-test', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JbpmLoginTest],
      html: `<jbpm-login-test></jbpm-login-test>`,
    });
    expect(page.root).toEqualHtml(`
      <jbpm-login-test>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </jbpm-login-test>
    `);
  });
});
