import { newSpecPage } from '@stencil/core/testing';
import { JbpmDashboard } from '../jbpm-dashboard';

describe('jbpm-dashboard', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JbpmDashboard],
      html: `<jbpm-dashboard></jbpm-dashboard>`,
    });
    expect(page.root).toEqualHtml(`
      <jbpm-dashboard>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </jbpm-dashboard>
    `);
  });
});
