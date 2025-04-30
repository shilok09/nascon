
    // Static Event Data (for demonstration)
    const eventsData = [
      {
        id: 'e1',
        name: 'Hackathon',
        category: 'Technical',
        type: 'Team',
        description: 'A 24-hour code sprint where teams compete to build innovative solutions. Themes will be announced at the start.',
        rules: [
          'Team size: 3-5 members',
          'Original work only; plagiarism leads to disqualification',
          'Follow the code of conduct at all times',
          'Submission must include code + presentation slides',
        ],
        schedule: '17th March, 10:00 AM - 18th March, 10:00 AM',
        fee: '₹150 per team',
      },
      {
        id: 'e2',
        name: 'Robotics Challenge',
        category: 'Technical',
        type: 'Team',
        description: 'Showcase your robotics skills! Build and race your custom robot on our obstacle course.',
        rules: [
          'Team size: up to 4',
          'You can only use permitted kits',
          'All robots must pass initial inspection',
        ],
        schedule: '18th March, 2:00 PM - 6:00 PM',
        fee: '₹200 per team',
      },
      {
        id: 'e3',
        name: 'Solo Dance',
        category: 'Cultural',
        type: 'Individual',
        description: 'Express yourself with rhythm and moves. Solo participants perform for up to 4 minutes.',
        rules: [
          'Performance limit: 4 minutes',
          'No explicit/derogatory content',
          'Props allowed with prior approval',
        ],
        schedule: '19th March, 11:00 AM',
        fee: '₹50 per participant',
      },
      {
        id: 'e4',
        name: 'Battle of Bands',
        category: 'Cultural',
        type: 'Team',
        description: 'Bands face off on the big stage. Bring your original music or play classic covers.',
        rules: [
          'Band size: 3-7',
          '10-minute setup + 12-minute performance',
          'No pyrotechnics',
        ],
        schedule: '19th March, 6:00 PM',
        fee: '₹300 per band',
      },
      {
        id: 'e5',
        name: 'Cricket Tournament',
        category: 'Sports',
        type: 'Team',
        description: 'Get your squad on the field! Knockout 8-team cricket tournament.',
        rules: [
          'Team size: up to 11 + 2 substitutes',
          '20 overs per side',
          'Standard cricket rules apply',
        ],
        schedule: '20th-21st March, 8:00 AM onwards',
        fee: '₹800 per team',
      },
      {
        id: 'e6',
        name: 'Table Tennis Singles',
        category: 'Sports',
        type: 'Individual',
        description: 'Face off in a knockout style singles tournament.',
        rules: [
          'Individual event',
          'Best of 3 sets, final best of 5',
          'Bring your own paddle',
        ],
        schedule: '20th March, 10:00 AM',
        fee: '₹40 per person',
      },
      {
        id: 'e7',
        name: 'Photography Contest',
        category: 'Cultural',
        type: 'Individual',
        description: 'Submit up to 3 original photographs on the theme "Dreams". Winners judged on creativity and technique.',
        rules: [
          'Photos must be original, no plagiarism',
          'Theme: "Dreams"',
          'Max 3 entries per participant',
        ],
        schedule: 'Submission Deadline: 17th March, 11:59 PM',
        fee: '₹30 per entry',
      }
    ];

    // Registration and Teams Data (simulate database with localStorage)
    function getRegisteredTeams() {
      return JSON.parse(localStorage.getItem('uniEventReg') || '[]');
    }
    function saveRegisteredTeams(teams) {
      localStorage.setItem('uniEventReg', JSON.stringify(teams));
    }

    // Navigation logic
    function changePage(page) {
      document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
      document.getElementById(page).classList.remove('hidden');
      document.querySelectorAll('.nav-btn').forEach(btn=>btn.classList.remove('active-nav'));
      if(page==='page-events'){ document.getElementById('nav-events').classList.add('active-nav');}
      if(page==='page-register'){ document.getElementById('nav-register').classList.add('active-nav'); }
      if(page==='page-teams'){ document.getElementById('nav-teams').classList.add('active-nav'); }
    }

    // EVENTS PAGE RENDERING
    function renderEvents(category='All') {
      const container = document.getElementById('events-list');
      container.innerHTML = '';
      let filtered = eventsData.filter(ev=>category==='All' || ev.category===category);
      for(let ev of filtered){
        let card = document.createElement('div');
        card.className = "bg-white rounded-lg shadow px-5 py-4 flex flex-col justify-between h-full";
        card.innerHTML = `
          <div>
            <h3 class="text-xl font-bold text-blue-700 mb-1">${ev.name}</h3>
            <span class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded mr-2">${ev.category}</span>
            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">${ev.type}</span>
            <p class="mt-2 text-gray-700">${ev.description.slice(0,100)}${ev.description.length>100?'...':''}</p>
          </div>
          <div class="mt-3 flex space-x-2">
            <button class="see-detail-btn bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow" data-id="${ev.id}"><i class="fas fa-eye mr-1"></i>Details</button>
            <button class="register-btn bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300" data-id="${ev.id}"><i class="fas fa-user-plus mr-1"></i> Register</button>
          </div>
        `;
        container.appendChild(card);
      }
      // Attach event handlers
      container.querySelectorAll('.see-detail-btn').forEach(btn=>{
        btn.onclick = (e)=>showEventDetail(btn.dataset.id);
      });
      container.querySelectorAll('.register-btn').forEach(btn=>{
        btn.onclick = (e)=>showRegModal(btn.dataset.id);
      });
    }

    function showEventDetail(eventId) {
      // Load event data
      let event = eventsData.find(ev=>ev.id===eventId);
      if(!event){ return; }
      document.getElementById('event-detail-title').innerText = event.name;
      document.getElementById('event-detail-category').innerText = event.category;
      document.getElementById('event-detail-type').innerText = event.type;
      document.getElementById('event-detail-description').innerText = event.description;
      let rulesUl = document.getElementById('event-detail-rules');
      rulesUl.innerHTML = '';
      for(let rule of event.rules){
        let li = document.createElement('li');
        li.innerText = rule;
        rulesUl.appendChild(li);
      }
      document.getElementById('event-detail-schedule').innerText = event.schedule;
      document.getElementById('event-detail-fee').innerText = event.fee;
      document.getElementById('event-register-btn').onclick = ()=>showRegModal(event.id);
      document.getElementById('event-detail-viewteams-btn').onclick = () => {
        // set select to current event & show teams page
        document.getElementById('score-event-select').value = event.id;
        renderTeamsTable();
        changePage('page-teams');
      }
      changePage('page-event-detail');
      window.scrollTo(0,0);
    }
    document.getElementById('btn-back-events').onclick = ()=>changePage('page-events');

    // CATEGORY FILTERING
    document.querySelectorAll('.category-btn').forEach(btn=>{
      btn.onclick = function(){
        document.querySelectorAll('.category-btn').forEach(b=>b.classList.remove('category-btn-active'));
        this.classList.add('category-btn-active');
        renderEvents(this.dataset.category);
      };
    });
    // Set 'All' as active on load
    document.querySelector('.category-btn[data-category="All"]').classList.add('category-btn-active');

    // NAVIGATION HANDLERS
    document.getElementById('nav-events').onclick = ()=>{changePage('page-events');renderEvents(document.querySelector('.category-btn-active').dataset.category);}
    document.getElementById('nav-register').onclick = ()=>{
      renderRegistrationEvents();
      changePage('page-register');
    }
    document.getElementById('nav-teams').onclick = ()=>{
      populateScoresEventsList();
      renderTeamsTable();
      changePage('page-teams');
    }

    // ON PAGE LOAD
    window.onload = ()=>{
      renderEvents('All');
      renderRegistrationEvents();
      populateScoresEventsList();
      renderTeamsTable();
    };


    //--- REGISTER PAGE LOGIC --//
    function renderRegistrationEvents() {
      let eventSelect = document.getElementById('reg-event');
      eventSelect.innerHTML = '';
      for(let ev of eventsData){
        let opt = document.createElement('option');
        opt.value = ev.id;
        opt.innerText = ev.name + " (" + ev.type + ")";
        eventSelect.appendChild(opt);
      }
      updateRegFormByEvent();
    }

    // Dynamically show/hide fields
    document.getElementById('reg-type').onchange = updateRegTypeFields;
    document.getElementById('reg-event').onchange = updateRegFormByEvent;
    function updateRegTypeFields(){
      if(document.getElementById('reg-type').value==="Team") {
        document.getElementById('team-fields').classList.remove('hidden');
        document.getElementById('individual-fields').classList.add('hidden');
        document.getElementById('reg-individual-name').removeAttribute('required');
        document.getElementById('reg-team-name').setAttribute('required','required');
      } else {
        document.getElementById('team-fields').classList.add('hidden');
        document.getElementById('individual-fields').classList.remove('hidden');
        document.getElementById('reg-individual-name').setAttribute('required','required');
        document.getElementById('reg-team-name').removeAttribute('required');
      }
    }
    function updateRegFormByEvent(){
      let evId = document.getElementById('reg-event').value;
      let ev = eventsData.find(e=>e.id===evId);
      document.getElementById('reg-type').value = ev?.type||'Individual';
      updateRegTypeFields();
    }
    // Form Submit
    document.getElementById('registration-form').onsubmit = function(e){
      e.preventDefault();
      let evId = this.event.value;
      let type = this.type.value;
      let entry = {
        eventId: evId,
        eventName: (eventsData.find(ev=>ev.id===evId)||{}).name,
        type,
        score: null,
      };
      if(type==='Individual'){
        entry.name = this.individualName.value.trim();
        entry.members = '';
      } else {
        entry.name = this.teamName.value.trim();
        entry.members = this.teamMembers.value.trim().split('\n').filter(Boolean).map(m=>m.trim());
      }
      // Save
      let teams = getRegisteredTeams();
      teams.push(entry);
      saveRegisteredTeams(teams);
      this.reset();
      updateRegTypeFields();
      document.getElementById('reg-success').classList.remove('hidden');
      setTimeout(()=>document.getElementById('reg-success').classList.add('hidden'),1800);
      renderTeamsTable(); // update teams page
    };


    //--- MODAL REGISTRATION --//
    function showRegModal(eventId){
      let ev = eventsData.find(e=>e.id===eventId);
      document.getElementById('modal-event-id').value = ev.id;
      document.getElementById('modal-reg-type').value = ev.type;
      updateModalRegFields();
      document.getElementById('modal-reg').classList.remove('hidden');
    }
    function closeRegModal(){
      document.getElementById('modal-reg-success').classList.add('hidden');
      document.getElementById('modal-reg').classList.add('hidden');
      document.getElementById('modal-reg-form').reset();
      updateModalRegFields();
    }
    document.getElementById('modal-reg-type').onchange = updateModalRegFields;
    function updateModalRegFields(){
      let type = document.getElementById('modal-reg-type').value;
      if(type==='Team'){
        document.getElementById('modal-team-fields').classList.remove('hidden');
        document.getElementById('modal-individual-fields').classList.add('hidden');
        document.getElementById('modal-indiv-name').removeAttribute('required');
        document.getElementById('modal-team-name').setAttribute('required','required');
      } else {
        document.getElementById('modal-team-fields').classList.add('hidden');
        document.getElementById('modal-individual-fields').classList.remove('hidden');
        document.getElementById('modal-indiv-name').setAttribute('required','required');
        document.getElementById('modal-team-name').removeAttribute('required');
      }
    }
    // Modal form submit
    document.getElementById('modal-reg-form').onsubmit = function(e){
      e.preventDefault();
      let evId = document.getElementById('modal-event-id').value;
      let type = document.getElementById('modal-reg-type').value;
      let entry = {
        eventId: evId,
        eventName: (eventsData.find(ev=>ev.id===evId)||{}).name,
        type,
        score: null,
      };
      if(type==='Individual'){
        entry.name = document.getElementById('modal-indiv-name').value.trim();
        entry.members = '';
      } else {
        entry.name = document.getElementById('modal-team-name').value.trim();
        entry.members = document.getElementById('modal-team-members').value.trim().split('\n').filter(Boolean);
      }
      let teams = getRegisteredTeams();
      teams.push(entry);
      saveRegisteredTeams(teams);
      document.getElementById('modal-reg-success').classList.remove('hidden');
      setTimeout(()=>{
        closeRegModal();
        renderTeamsTable();
      },1000);
    }

    //--- TEAMS AND SCORES PAGE ---//
    function populateScoresEventsList(){
      let sel = document.getElementById('score-event-select');
      sel.innerHTML = '';
      let optAll = document.createElement('option');
      optAll.value = 'All';
      optAll.textContent = "All Events";
      sel.appendChild(optAll);
      for(let ev of eventsData){
        let opt = document.createElement('option');
        opt.value = ev.id;
        opt.textContent = ev.name;
        sel.appendChild(opt);
      }
      sel.onchange = renderTeamsTable;
    }

    function renderTeamsTable(){
      let tbody = document.getElementById('teams-table-body');
      tbody.innerHTML = '';
      let filterEventId = document.getElementById('score-event-select').value || 'All';
      let teams = getRegisteredTeams().filter(t=>filterEventId==='All'||t.eventId===filterEventId);
      for (let i=0;i<teams.length;i++){
        let tr = document.createElement('tr');
        tr.className = i%2?'bg-gray-50':'';
        tr.innerHTML = `
          <td class="py-2 px-4">${i+1}</td>
          <td class="py-2 px-4 font-semibold">${teams[i].name}</td>
          <td class="py-2 px-4">${teams[i].eventName}</td>
          <td class="py-2 px-4">${teams[i].type==='Individual'?teams[i].name:(Array.isArray(teams[i].members)?teams[i].members.join(', ') : teams[i].members || '-')}</td>
          <td class="py-2 px-4">
            <span class="score-display">${teams[i].score!==null?teams[i].score:'-'}</span>
            <button class="ml-2 text-blue-600 hover:underline score-edit-btn" data-idx="${i}" title="Edit Score"><i class="fas fa-pen"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      }
      // Score Edit
      tbody.querySelectorAll('.score-edit-btn').forEach(btn=>{
        btn.onclick = function(){
          let idx = btn.dataset.idx;
          let val = prompt('Enter score:');
          if(val!==null && val!==''){
            let regTeams = getRegisteredTeams();
            regTeams[idx].score=val;
            saveRegisteredTeams(regTeams);
            renderTeamsTable();
          }
        }
      });
    }

    // Navigation from Event Detail's teams button
    document.getElementById('score-event-select').onchange = renderTeamsTable;

    // Utility: close modal on background click
    document.getElementById('modal-reg').onclick = function(e){
      if(e.target===this) closeRegModal();
    };