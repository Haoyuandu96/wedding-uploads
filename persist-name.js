/* wedding-uploads: remember the guest's name across visits.
   Drop-in script. It tries to find the name input and enhances it with:
   - localStorage persistence
   - optional "Signed in as ..." chip if you include the snippet.html markup
*/
(function () {
  const NAME_KEY = 'weddingUploads.guestName';

  // Try to find the input by common selectors
  function findNameInput() {
    const byId = document.getElementById('guestName');
    if (byId) return byId;

    // name or data attribute
    const q =
      'input[placeholder="Your name"], input[placeholder*="Your Name"], input[name="guestName"], input[data-role="guest-name"]';
    const el = document.querySelector(q);
    if (el) return el;

    // Fallback: first text input within the uploader UI
    const candidates = Array.from(document.querySelectorAll('input[type="text"]'));
    return candidates.find(x => /name/i.test(x.placeholder || x.name || '')) || candidates[0] || null;
  }

  const nameInput = findNameInput();
  if (!nameInput) {
    console.warn('[persist-name] Could not find a name input. Ensure it has id="guestName" or placeholder "Your name".');
    return;
  }

  // Optional "Signed in as" chip elements if present
  const signedWrap = document.getElementById('signedInAs') || null;
  const signedName = document.getElementById('signedName') || null;
  const changeBtn  = document.getElementById('changeName') || null;
  const nameRow    = document.getElementById('name-row') || (nameInput.closest('.name-row') || nameInput.parentElement);

  function getSavedName() {
    try { return (localStorage.getItem(NAME_KEY) || '').trim(); }
    catch (e) { return ''; }
  }
  function saveName(n) {
    try { if (n) localStorage.setItem(NAME_KEY, n); } catch (e) {}
  }
  function clearName() {
    try { localStorage.removeItem(NAME_KEY); } catch (e) {}
  }
  function useName(n) {
    if (!nameInput) return;
    if (n) nameInput.value = n;
    if (signedName) signedName.textContent = n || '';
    if (signedWrap) signedWrap.hidden = !n;
    if (nameRow && n) {
      // Hide the input row if we have a name and a chip exists
      if (signedWrap) nameRow.style.display = 'none';
    } else if (nameRow) {
      nameRow.style.display = '';
    }
  }

  // Initialize
  useName(getSavedName());

  // Persist when changed/blurred
  function commit() {
    const n = (nameInput.value || '').trim();
    if (n) { saveName(n); useName(n); }
  }
  nameInput.addEventListener('change', commit);
  nameInput.addEventListener('blur', commit);
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); });

  if (changeBtn) {
    changeBtn.addEventListener('click', () => {
      clearName();
      useName('');
      if (nameInput) { nameInput.focus(); }
    });
  }

  // Expose a helper to fetch/persist the name for your uploader code
  window.getUploaderName = function () {
    const typed = (nameInput && (nameInput.value || '').trim()) || '';
    const saved = getSavedName();
    const n = typed || saved;
    if (n) saveName(n);
    return n;
  };
})();