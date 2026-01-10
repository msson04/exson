document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     FIREBASE INIT
  ============================= */
  const firebaseConfig = {
    apiKey: "AIzaSyBJWU594MekIaM6_syF5ylSliTt3q1EQf4",
    authDomain: "minseok-profile-board.firebaseapp.com",
    projectId: "minseok-profile-board",
    storageBucket: "minseok-profile-board.firebasestorage.app",
    messagingSenderId: "417663849696",
    appId: "1:417663849696:web:7e4c6e3acf2c6c4bcd2c85"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  /* =============================
     DOM ELEMENTS
  ============================= */
  const writerInput = document.getElementById("writer");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const submitBtn = document.getElementById("submit");
  const boardList = document.getElementById("boardList");

  /* =============================
     UTILS
  ============================= */
  function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  function disableSubmit(state) {
    submitBtn.disabled = state;
    submitBtn.textContent = state ? "등록 중..." : "글 등록";
  }

  /* =============================
     ENTER KEY PREVENT
  ============================= */
  [writerInput, titleInput].forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") e.preventDefault();
    });
  });

  /* =============================
     POST SUBMIT
  ============================= */
  submitBtn.addEventListener("click", async () => {
    const writer = writerInput.value.trim();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!writer || !title || !content) {
      showToast("모든 항목을 입력해주세요");
      return;
    }

    try {
      disableSubmit(true);

      await db.collection("posts").add({
        writer,
        title,
        content,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      writerInput.value = "";
      titleInput.value = "";
      contentInput.value = "";

      showToast("등록되었습니다");

    } catch (err) {
      console.error(err);
      showToast("등록에 실패했습니다");
    } finally {
      disableSubmit(false);
    }
  });

  /* =============================
     REALTIME LISTENER
  ============================= */
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      boardList.innerHTML = "";

      snapshot.forEach(doc => {
        const post = doc.data();
        const item = document.createElement("article");
        item.className = "board-item";

        const date = post.createdAt
          ? post.createdAt.toDate().toLocaleDateString("ko-KR")
          : "";

        item.innerHTML = `
          <h4>${escapeHTML(post.title)}</h4>
          <p class="meta">${escapeHTML(post.writer)} · ${date}</p>
          <p class="preview">${escapeHTML(post.content)}</p>
        `;

        boardList.appendChild(item);
      });
    });

  /* =============================
     XSS BASIC PROTECTION
  ============================= */
  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

});
