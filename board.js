document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     Firebase 초기화
     ⚠️ index.html / portfolio.html 에서
     firebase-app / firestore 스크립트 로드 필수
  ============================= */
  const firebaseConfig = {
    apiKey: "AIzaSyBJWU594MekIaM6_syF5ylSliTt3q1EQf4",
    authDomain: "minseok-profile-board.firebaseapp.com",
    projectId: "minseok-profile-board",
    storageBucket: "minseok-profile-board.firebasestorage.app",
    messagingSenderId: "417663849696",
    appId: "1:417663849696:web:7e4c6e3acf2c6c4bcd2c85"
  };

  // 🔴 중복 초기화 방지 (중요)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  /* =============================
     ADMIN
  ============================= */
  const ADMIN_KEY = "board_admin";
  const ADMIN_PASSWORD = "8476"; // 🔐 반드시 변경

  let isAdmin = sessionStorage.getItem(ADMIN_KEY) === "true";

  document.addEventListener("keydown", e => {
    if (e.shiftKey && e.key.toLowerCase() === "a") {
      const pw = prompt("관리자 비밀번호 입력");
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_KEY, "true");
        alert("관리자 모드 활성화");
        location.reload();
      } else {
        alert("비밀번호가 틀렸습니다");
      }
    }
  });

  /* =============================
     DOM
  ============================= */
  const writerInput = document.getElementById("writer");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const submitBtn = document.getElementById("submit");
  const boardList = document.getElementById("boardList");

  if (!writerInput || !titleInput || !contentInput || !submitBtn || !boardList) {
    console.error("❌ 게시판 DOM 요소를 찾을 수 없습니다");
    return;
  }

  /* =============================
     WRITE (저장)
  ============================= */
  submitBtn.addEventListener("click", async () => {
    if (
      !writerInput.value.trim() ||
      !titleInput.value.trim() ||
      !contentInput.value.trim()
    ) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    submitBtn.disabled = true;

    try {
      await db.collection("posts").add({
        writer: writerInput.value.trim(),
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        pinned: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      writerInput.value = "";
      titleInput.value = "";
      contentInput.value = "";

    } catch (err) {
      console.error("❌ 글 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다");
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* =============================
     READ (조회)
     🔴 pinned + createdAt 정렬은
     Firestore 콘솔에서 복합 인덱스 생성 필요
     (에러 메시지에 링크 자동 제공됨)
  ============================= */
  db.collection("posts")
    .orderBy("pinned", "desc")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      boardList.innerHTML = "";

      if (snapshot.empty) {
        boardList.innerHTML = "<p>게시글이 없습니다.</p>";
        return;
      }

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
          ${post.pinned ? `<div class="pin">📌 고정된 글</div>` : ""}
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
    }, err => {
      console.error("❌ 게시글 조회 실패:", err);
      alert("게시글을 불러오지 못했습니다");
    });

  /* =============================
     ADMIN ACTIONS
  ============================= */
  function bindAdminActions() {
    if (!isAdmin) return;

    document.querySelectorAll("[data-del]").forEach(btn => {
      btn.onclick = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
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
