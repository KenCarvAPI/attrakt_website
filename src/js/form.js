import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function initTrendsReportForm() {
  const form = document.getElementById('trendsReportForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const input = form.querySelector('input[type="email"]');
    const originalText = btn.textContent;

    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: input.value, source: 'trends_report' });

      if (error) {
        if (error.code === '23505') {
          btn.textContent = 'Already subscribed!';
          btn.style.background = 'var(--secondary)';
        } else {
          throw error;
        }
      } else {
        btn.textContent = 'Subscribed!';
        btn.style.background = 'var(--accent)';
        input.value = '';
      }
    } catch {
      btn.textContent = 'Something went wrong';
      btn.style.background = '#cc3333';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const inputs = form.querySelectorAll('input, select, textarea');
    const data = {
      first_name: inputs[0]?.value || '',
      last_name: inputs[1]?.value || '',
      email: inputs[2]?.value || '',
      company: inputs[3]?.value || '',
      service_interest: inputs[4]?.value || '',
      goals: inputs[5]?.value || '',
    };

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-submit`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      btn.textContent = 'Message sent!';
      btn.style.background = 'var(--secondary)';
      form.reset();
    } catch {
      btn.textContent = 'Something went wrong';
      btn.style.background = '#cc3333';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  });
}
