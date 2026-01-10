document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     Firebase
  ============================= */
  const firebaseConfig = {
    apiKey: "AIzaSyBJWU594MekIaM6_syF5ylSliTt3q1EQf4",
    authDomain: "minseok-profile-board.firebaseapp.com",
    projectId: "minseok-profile-board",
    storageBucket: "minseok-profile-board.firebasestorage.app",
    messagingSenderId: "417663849696",
    appId: "1:417663849696:web:7e4c6e3acf2c6c4bcd2c85"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  /* =============================
     ADMIN
  ============================= */
  const ADMIN_KEY = "board_admin";
  const ADMIN_PASSWORD = "1234";

  const isAdmin = sessionStorage.getItem(ADMIN_KEY) === "true";

  document.addEventListener("keydown", e => {
    if (e.shiftKey && e.key.toLowerCase() === "a") {
      const pw = prompt("관리자 비밀번호");
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_KEY, "true");
        alert("관리자 모드 활성화");
        location.reload();
      }
    }
  });

  /* =============================
     DOM
  ============================= */
  const writer = document.getElementById("writer");
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const submit = document.getElementById("submit");
  const boardList = document.getElementById("boardList");

  /* =============================
     모바일 키보드 대응
  ============================= */
  [writer, title, content].forEach(el => {
    el.addEventListener("focus", () => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* =============================
     WRITE
  ============================= */
  submit.addEventListener("click", async () => {
    if (!writer.value || !title.value || !content.value) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    submit.disabled = true;

    await db.collection("posts").add({
      writer: writer.value.trim(),
      title: title.value.trim(),
      content: content.value.trim(),
      pinned: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    writer.value = "";
    title.value = "";
    content.value = "";

    submit.disabled = false;
  });

  /* =============================
     READ
  ============================= */
  db.collection("posts")
    .orderBy("pinned", "desc")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      boardList.innerHTML = "";

      snapshot.forEach(doc => {
        const post = doc.data();
        const id = doc.id;

        const date = post.createdAt
          ? post.createdAt.toDate().toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
          : "";

        const item = document.createElement("article");
        item.className = "board-item";

        item.innerHTML = `
          ${post.pinned ? `<div class="pin">📌 고정</div>` : ""}
          <h4>${escapeHTML(post.title)}</h4>
          <p class="meta">${escapeHTML(post.writer)} · ${date}</p>
          <p class="preview">${escapeHTML(post.content)}</p>

          ${isAdmin ? `
            <div class="admin-actions">
              <button data-del="${id}">삭제</button>
              <button data-pin="${id}">
                ${post.pinned ? "고정 해제" : "고정"}
              </button>
            </div>
          ` : ""}
        `;

        boardList.appendChild(item);
      });

      bindAdminActions();
    });

  /* =============================
     ADMIN ACTIONS
  ============================= */
  function bindAdminActions() {
    if (!isAdmin) return;

    document.querySelectorAll("[data-del]").forEach(btn => {
      btn.onclick = async () => {
        if (!confirm("삭제하시겠습니까?")) return;
        await db.collection("posts").doc(btn.dataset.del).delete();
      };
    });

    document.querySelectorAll("[data-pin]").forEach(btn => {
      btn.onclick = async () => {
        const ref = db.collection("posts").doc(btn.dataset.pin);
        const snap = await ref.get();
        await ref.update({ pinned: !snap.data().pinned });
      };
    });
  }

  /* =============================
     XSS 방지
  ============================= */
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[m]);
  }

});
