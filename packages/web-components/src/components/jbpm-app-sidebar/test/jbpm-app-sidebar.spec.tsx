import { newSpecPage } from '@stencil/core/testing';
import { JbpmAppSidebar } from '../jbpm-app-sidebar';

describe('jbpm-app-sidebar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JbpmAppSidebar],
      html: `<jbpm-app-sidebar></jbpm-app-sidebar>`,
    });
    expect(page.root).toEqualHtml(`
      <jbpm-app-sidebar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </jbpm-app-sidebar>
    `);
  });
});
