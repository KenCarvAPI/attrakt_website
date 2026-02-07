import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
      message: inputs[5]?.value || '',
    };

    const { error } = await supabase
      .from('contact_submissions')
      .insert([data]);

    if (error) {
      btn.textContent = 'Something went wrong';
      btn.style.background = '#cc3333';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
      return;
    }

    btn.textContent = 'Message sent!';
    btn.style.background = 'var(--secondary)';
    form.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  });
}
