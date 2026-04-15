export default function decorate(block) {
  const placeholder = block.textContent.trim() || 'Search UPS Stories...';

  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', 'Search');

  // Pre-fill from URL query parameter
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    input.value = params.get('q');
  }

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-submit';
  button.textContent = 'Search';
  button.setAttribute('aria-label', 'Submit search');

  const results = document.createElement('div');
  results.className = 'search-results';

  form.append(input, button);
  block.append(form, results);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      window.location.href = `/us/en/search.html?q=${encodeURIComponent(query)}`;
    }
  });
}
