(function(){
  const form = document.getElementById('booking-form');
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  const submitBtn = document.getElementById('submitBtn');
  const bookNowBtn = document.getElementById('bookNow');
  const formMessage = document.getElementById('formMessage');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');

  // Utility: format date to YYYY-MM-DD for input min
  function toISODate(d){
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Set minimum dates: check-in >= today, check-out >= check-in + 1
  const today = new Date();
  checkIn.min = toISODate(today);
  checkIn.addEventListener('change', ()=>{
    if(!checkIn.value) return;
    const inDate = new Date(checkIn.value);
    const next = new Date(inDate.getTime()+24*60*60*1000);
    checkOut.min = toISODate(next);
    // If check-out is earlier/equal, clear it to force user to reselect
    if(checkOut.value && new Date(checkOut.value) <= inDate){
      checkOut.value = '';
    }
  });

  // Basic validation helpers
  function showMessage(text, isError){
    formMessage.textContent = text;
    formMessage.style.color = isError ? '#a00' : '#0a6e4f';
  }

  function validateForm(){
    // Use browser validity first
    if(!form.reportValidity) { /* fallback */ }

    // Custom checks: date logic
    if(!checkIn.value || !checkOut.value) {
      showMessage('Please select check-in and check-out dates.', true);
      return false;
    }
    const inDate = new Date(checkIn.value);
    const outDate = new Date(checkOut.value);
    if(outDate <= inDate){
      showMessage('Check-out must be after check-in.', true);
      return false;
    }
    // Additional checks can go here (phone format, etc.)
    return true;
  }

  async function submitForm(data){
    // Mock submission endpoint — change to real API in integration    
    const endpoint = '/api/booking';
    submitBtn.disabled = true;
    showMessage('Submitting...', false);
    try{
      const resp = await fetch(endpoint, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(!resp.ok) throw new Error(`Server responded ${resp.status}`);
      // success
      showMessage('Request submitted. A confirmation will be sent to your email.', false);
      openModal('Reservation Submitted','Thank you — your request was received at Kings Resort and Cove. We will contact you to confirm availability.');
      form.reset();
      // Reset min for checkOut after reset
      checkIn.min = toISODate(new Date());
      checkOut.min = '';
    }catch(err){
      showMessage('Submission failed. Try again or contact the resort directly.', true);
      console.error('Booking submit error', err);
    }finally{
      submitBtn.disabled = false;
    }
  }

  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    // Let browser show native validation messages first
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    if(!validateForm()) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // Convert number fields
    data.adults = Number(data.adults || 1);
    data.children = Number(data.children || 0);

    // Submit via AJAX (fetch)
    submitForm(data);
  });

  // Book Now emulates immediate booking flow — here just submits the same data  
  bookNowBtn.addEventListener('click', ()=>{
    // Try to use the same validation path — if invalid, report
    if(!form.checkValidity()){ form.reportValidity(); return; }
    if(!validateForm()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    submitForm(data);
  });

  // Modal helpers
  function openModal(title, body){
    const t = document.getElementById('modalTitle');
    const b = document.getElementById('modalBody');
    t.textContent = title; b.textContent = body;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  // Expose a function to open modal (useful for embedding/integration)  
  window.openBookingModal = function(){
    openModal('Book a Room','Please complete and submit the booking form.');
  };
})();
