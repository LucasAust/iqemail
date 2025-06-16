// src/templates.js

export const templates = {
  client: {
    subject: 'Client Management Tools from IQVentory',
    build: ({ name, contactor, role, niche }) => {
      let html = `
        <p>Hello ${name},</p>
        <p>I’m <b>${contactor}</b>, the <b>${role}</b> at IQVentory. 
        We specialize in client-management software to keep your 
        appointments, invoices, and customer communications all in one place.</p>`;
      if (niche) {
        html += `<p>As a leader in <b>${niche}</b>, you’ll love our custom dashboards and AI-driven reminders!</p>`;
      }
      html += `<p>Reply to this email to schedule a demo.<br>Thanks,<br><b>${contactor}</b></p>`;
      return { html, text: html.replace(/<[^>]+>/g, '') };
    }
  },
  inventory: {
    subject: 'Inventory Management Solutions by IQVentory',
    build: ({ name, contactor, role, niche }) => {
      let html = `
        <p>Hi ${name},</p>
        <p>I’m <b>${contactor}</b> (<b>${role}</b>) at IQVentory. 
        Our inventory tools help you track stock levels, automate reorders, 
        and integrate with your POS.</p>`;
      if (niche) {
        html += `<p>Since you’re in <b>${niche}</b>, our barcode-driven scanner will be a game-changer.</p>`;
      }
      html += `<p>Interested? Let’s chat!<br>— ${contactor}</p>`;
      return { html, text: html.replace(/<[^>]+>/g, '') };
    }
  },
  landlord: {
    subject: 'Landlord-Tenant Platform from IQVentory',
    build: ({ name, contactor, role, niche }) => {
      return {
        html: `
          <p>Hello ${name},</p>
          <p>I’m <b>${contactor}</b> (<b>${role}</b>) at IQVentory. 
          We’ve built a landlord-tenant matchmaking system with safety training 
          modules tailored to property managers.</p>
          <p>Reply to see how it fits your portfolio.<br>Thanks,<br><b>${contactor}</b></p>`,
        text: `Hello ${name},\n\nI’m ${contactor} (${role}) at IQVentory...`
      };
    }
  },
  ecommerce: {
    subject: 'E-commerce Growth Tools by IQVentory',
    build: ({ name, contactor, role, niche }) => {
      return {
        html: `
          <p>Hey ${name},</p>
          <p>I’m <b>${contactor}</b> (<b>${role}</b>) at IQVentory. 
          Our e-commerce suite boosts conversion with AI chatbots, 
          abandoned-cart recovery, and seamless payment integrations.</p>
          <p>Let me know when you have 10 minutes to talk.</p>
          <p>— ${contactor}</p>`,
        text: `Hello ${name},\n\nI’m ${contactor} (${role}) at IQVentory...`
      };
    }
  }
};
