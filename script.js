/* ============================================================
   RAGEBLAST V3
   Front-end simulation only — there is no server, no real other
   person, and no persistence. Every "match" and "reply" below is
   generated locally. See README for what a real backend would need.
   ============================================================ */

(() => {
  "use strict";

  /* ---------------- archetypes ---------------- */
  const ARCHETYPES = {
    "The Chaos Goblin": {
      traits: [8, 9, 3, 10, 3, 9],
      lines: [
        "Incredible. You've achieved a rage so pure it should be bottled and sold as fuel.",
        "I read that twice and both times I pictured you throwing a chair in slow motion.",
        "Have you tried yelling this into a pillow first? No? Bold. Respect.",
        "This is the emotional equivalent of a fire alarm going off at 3am for no reason.",
        "You didn't vent, you detonated. I felt that from here.",
        "Ten out of ten chaos, zero out of ten chill. Balanced diet though."
      ]
    },
    "The Roaster": {
      traits: [7, 9, 2, 6, 5, 6],
      lines: [
        "That problem really looked at every possible day and chose to happen to you specifically.",
        "If frustration burned calories you'd have abs by now.",
        "You're mad at the situation, but the situation isn't losing sleep over you either.",
        "This reads like a Yelp review for your own week. One star, would not recommend.",
        "Sounds rough. Also sounds like the universe has a personal vendetta and great timing.",
        "I'm not saying you're overreacting, I'm saying the reaction has its own zip code."
      ]
    },
    "The Wise Monk": {
      traits: [3, 2, 7, 2, 9, 5],
      lines: [
        "Anger is usually grief wearing a louder coat. What did you actually lose here?",
        "You are allowed to be furious and still ask what this is protecting you from.",
        "Most rage is an expectation that got quietly broken without asking permission first.",
        "Notice that the fire feels urgent. It rarely is the whole truth, only the loudest part.",
        "Sit with it another minute before you decide what it means about you.",
        "Whatever this is, it will not feel this large in a week. That's not dismissal, that's just time."
      ]
    },
    "The Calm Therapist": {
      traits: [3, 1, 9, 2, 7, 4],
      lines: [
        "That sounds genuinely exhausting to carry, not just annoying.",
        "It makes sense you're angry — it sounds like something you needed didn't show up.",
        "I hear how tired you are underneath the anger. That part matters more than the rage does.",
        "You're allowed to feel this without immediately fixing it or explaining it away.",
        "What would actually help right now — being heard, or being distracted?",
        "This sounds less like anger and more like you've been patient for a long time."
      ]
    },
    "The Meme Lord": {
      traits: [9, 5, 3, 7, 4, 8],
      lines: [
        "current status: emotional_damage.exe has stopped responding",
        "narrator voice: they were, in fact, not okay.",
        "this you? [screenshots your entire week and posts it with no context]",
        "plot twist: the real villain was your calendar all along",
        "loading dramatic soundtrack for your Tuesday... buffering... buffering...",
        "achievement unlocked: survived a day that owed you nothing"
      ]
    },
    "The Poet": {
      traits: [4, 3, 6, 4, 5, 7],
      lines: [
        "Even a match burns brightest right before it runs out of stick.",
        "You are not the storm. You are the one still standing after it passed through.",
        "Some days ask more of us than they give back. Today sounds like one of those.",
        "Anger, unspent, just becomes weather you carry indoors.",
        "There is a version of tomorrow where this is a story, not a wound.",
        "You said the loud thing. Somewhere under it is the quiet thing. That's the real one."
      ]
    },
    "The Ice-Cold Killer": {
      traits: [5, 8, 1, 3, 8, 6],
      lines: [
        "Noted. Filed under things that will not matter in six months.",
        "Correct response: none. This does not deserve more of your electricity.",
        "You already know the move here. Stop asking the internet to approve it.",
        "Cold read: you're not stuck, you're just avoiding the obvious next step.",
        "This is a Tuesday problem wearing a crisis costume. Downgrade it.",
        "Feel it for ten more minutes. Then close the tab on it, literally and otherwise."
      ]
    },
    "The Philosopher": {
      traits: [4, 2, 5, 3, 9, 6],
      lines: [
        "Ask what you're actually angry at — the event, or what it implies about your control.",
        "Most fury is a disagreement with reality about how things were supposed to go.",
        "If a stranger did exactly this to someone else, would you call it a crisis or a Tuesday?",
        "The feeling is data, not instruction. It's telling you something mattered, not what to do next.",
        "You get to choose what this means. That's the only part of it that was ever yours.",
        "Ten years from now this is a sentence, not a chapter. Let it be that now, too."
      ]
    }
  };

  const TRAIT_LABELS = ["Humor", "Savage", "Empathy", "Chaos", "Logic", "Unexpected"];

  /* ---------------- crisis safety net ---------------- */
  const CRISIS_PATTERNS = [
    /kill myself/i, /killing myself/i, /suicid/i, /want(ed)? to die/i,
    /end(ing)? my life/i, /end it all/i, /don'?t want to (be alive|live)/i,
    /hurt myself/i, /self[\s-]?harm/i, /no reason to live/i
  ];
  function containsCrisisSignal(text) {
    return CRISIS_PATTERNS.some((re) => re.test(text));
  }

  /* ---------------- heat gauge ---------------- */
  function computeHeat(text) {
    if (!text.trim()) return 0;
    const len = Math.min(text.length / 400, 1) * 40;
    const caps = (text.match(/[A-Z]{3,}/g) || []).length * 6;
    const bangs = (text.match(/!/g) || []).length * 5;
    const qs = (text.match(/\?{2,}/g) || []).length * 4;
    return Math.max(4, Math.min(100, Math.round(len + caps + bangs + qs)));
  }

  /* ---------------- weighted archetype pick ---------------- */
  function pickArchetype(heat) {
    let pool;
    if (heat >= 66) {
      pool = ["The Chaos Goblin", "The Roaster", "The Ice-Cold Killer", "The Meme Lord",
              "The Chaos Goblin", "The Roaster"]; // extra weight
    } else if (heat >= 33) {
      pool = ["The Meme Lord", "The Poet", "The Philosopher", "The Roaster",
              "The Ice-Cold Killer"];
    } else {
      pool = ["The Wise Monk", "The Calm Therapist", "The Poet", "The Philosopher",
              "The Wise Monk"];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function jitteredTraits(base) {
    return base.map((v) => Math.max(1, Math.min(10, v + Math.round((Math.random() - 0.5) * 3))));
  }

  /* ---------------- DOM refs ---------------- */
  const msg = document.getElementById("msg");
  const gaugeFill = document.getElementById("gaugeFill");
  const heatLabel = document.getElementById("heatlabel");
  const charcount = document.getElementById("charcount");
  const blastBtn = document.getElementById("blastBtn");

  const panels = {
    vent: document.getElementById("panel-vent"),
    match: document.getElementById("panel-match"),
    reply: document.getElementById("panel-reply"),
    rate: document.getElementById("panel-rate"),
    closed: document.getElementById("panel-closed"),
    safety: document.getElementById("panel-safety")
  };
  const railSteps = Array.from(document.querySelectorAll(".rail-step"));

  const matchingLine = document.getElementById("matchingLine");
  const readout = document.getElementById("readout");
  const traitGrid = document.getElementById("traitGrid");

  const replyArchetype = document.getElementById("replyArchetype");
  const replyText = document.getElementById("replyText");
  const replyNext = document.getElementById("replyNext");

  const rateGrid = document.getElementById("rateGrid");
  const skipRate = document.getElementById("skipRate");
  const finishBtn = document.getElementById("finishBtn");

  const cooldownRing = document.getElementById("cooldownRing");
  const ventAgain = document.getElementById("ventAgain");
  const safetyBack = document.getElementById("safetyBack");

  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function after(ms, fn) { const id = setTimeout(fn, ms); timers.push(id); return id; }

  /* ---------------- panel + rail switching ---------------- */
  function showPanel(name) {
    Object.values(panels).forEach((p) => p.classList.add("is-hidden"));
    panels[name].classList.remove("is-hidden");
  }

  function setRail(stepName) {
    const order = ["vent", "match", "reply", "rate", "closed"];
    const idx = order.indexOf(stepName);
    railSteps.forEach((li) => {
      const s = li.dataset.step;
      const sIdx = order.indexOf(s);
      li.classList.remove("is-active", "is-done");
      if (sIdx < idx) li.classList.add("is-done");
      if (sIdx === idx) li.classList.add("is-active");
    });
  }

  /* ---------------- live gauge while typing ---------------- */
  msg.addEventListener("input", () => {
    const text = msg.value;
    charcount.textContent = `${text.length} / 600`;
    const heat = computeHeat(text);
    gaugeFill.style.width = heat + "%";
    gaugeFill.style.backgroundPosition = heat + "% 0%";
    heatLabel.textContent = `HEAT ${heat}°`;
  });

  /* ---------------- blast flow ---------------- */
  blastBtn.addEventListener("click", () => {
    const text = msg.value.trim();
    if (!text) {
      msg.focus();
      msg.style.borderColor = "var(--heat-3)";
      after(600, () => (msg.style.borderColor = ""));
      return;
    }

    if (containsCrisisSignal(text)) {
      showPanel("safety");
      return;
    }

    runMatchSequence(text);
  });

  function runMatchSequence(text) {
    clearTimers();
    const heat = computeHeat(text);
    blastBtn.disabled = true;
    showPanel("match");
    setRail("match");
    readout.hidden = true;
    matchingLine.textContent = "scanning the anonymous pool…";

    after(900, () => {
      matchingLine.textContent = "signal found. reading incoming energy…";
    });

    after(1900, () => {
      const archetype = pickArchetype(heat);
      const traits = jitteredTraits(ARCHETYPES[archetype].traits);
      renderTraitReadout(traits);
      readout.hidden = false;
      matchingLine.textContent = "responder is typing…";

      after(1800, () => {
        deliverReply(archetype);
      });
    });
  }

  function renderTraitReadout(traits) {
    traitGrid.innerHTML = TRAIT_LABELS.map((label, i) => {
      const v = traits[i];
      return `
        <div class="trait">
          <div class="trait-name"><span>${label}</span><span>${v}/10</span></div>
          <div class="trait-bar"><span style="width:${v * 10}%"></span></div>
        </div>`;
    }).join("");
  }

  function deliverReply(archetype) {
    const bank = ARCHETYPES[archetype].lines;
    const line = bank[Math.floor(Math.random() * bank.length)];
    replyArchetype.textContent = archetype.toUpperCase();
    replyText.textContent = line;
    showPanel("reply");
    setRail("reply");
  }

  /* ---------------- manual reply progression ---------------- */
  replyNext.addEventListener("click", () => {
    showPanel("rate");
    setRail("rate");
  });

  /* ---------------- rating ---------------- */
  rateGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".rate-chip");
    if (!btn) return;
    Array.from(rateGrid.children).forEach((c) => c.classList.remove("is-picked"));
    btn.classList.add("is-picked");
    // Removed auto-advance here so users have control.
  });

  finishBtn.addEventListener("click", goToClosed);
  skipRate.addEventListener("click", goToClosed);

  /* ---------------- closed / cooldown ---------------- */
  function goToClosed() {
    showPanel("closed");
    setRail("closed");
    animateCooldown();
    // Safely re-enable blastBtn now that the thread is permanently closed
    blastBtn.disabled = false;
  }

  function animateCooldown() {
    let deg = 360;
    cooldownRing.style.background =
      `conic-gradient(var(--heat-4) ${deg}deg, var(--surface-2) ${deg}deg)`;
    const step = () => {
      deg -= 40;
      const color = deg > 180 ? "var(--heat-3)" : "var(--heat-1)";
      cooldownRing.style.background =
        `conic-gradient(${color} ${Math.max(deg, 0)}deg, var(--surface-2) ${Math.max(deg, 0)}deg)`;
      if (deg > 0) after(140, step);
    };
    after(140, step);
  }

  ventAgain.addEventListener("click", resetAll);
  safetyBack.addEventListener("click", () => {
    showPanel("vent");
    setRail("vent");
  });

  function resetAll() {
    clearTimers();
    msg.value = "";
    charcount.textContent = "0 / 600";
    gaugeFill.style.width = "0%";
    heatLabel.textContent = "HEAT 0°";
    blastBtn.disabled = false;
    showPanel("vent");
    setRail("vent");
    msg.focus();
  }
})();
