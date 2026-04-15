export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.setAttribute('role', 'tablist');

  const panels = [];

  rows.forEach((row, idx) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const contentCell = cells[1];

    // Create tab button
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.id = `tab-${idx + 1}`;
    btn.textContent = labelCell?.textContent?.trim() || `Tab ${idx + 1}`;
    btn.setAttribute('aria-controls', `tabpanel-${idx + 1}`);

    if (idx === 0) btn.classList.add('is-active');
    tabList.append(btn);

    // Create tab panel
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = `tabpanel-${idx + 1}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${idx + 1}`);

    if (contentCell) {
      while (contentCell.firstChild) panel.append(contentCell.firstChild);
    }

    if (idx === 0) panel.classList.add('is-visible');
    panels.push(panel);

    // Tab click handler
    btn.addEventListener('click', () => {
      tabList.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-visible'));
      btn.classList.add('is-active');
      panel.classList.add('is-visible');
    });
  });

  block.textContent = '';
  block.append(tabList, ...panels);
}
