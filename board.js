document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     🔥 Firebase 설정 (여기 붙여넣기)
  ============================= */
  const firebaseConfig = {
    apiKey: "여기에_네_apiKey",
    authDomain: "여기에_authDomain",
    projectId: "여기에_projectId",
    storageBucket: "여기에_storageBucket",
    messagingSenderId: "여기에_senderId",
    appId: "여기에_appId"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  /* =============================
     DOM
  ============================= */
  const writer = document.getElementById("writer");
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const submit = document.getElementById("submit");
  const boardList = document.getElementById("boardList");

  /* =============================
     글 등록
  ============================= */
  submit.addEventListener("click", async () => {
    if (!writer.value || !title.value || !content.value) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    await db.collection("posts").add({
      writer: writer.value,
      title: title.value,
      content: content.value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    writer.value = "";
    title.value = "";
    content.value = "";
  });

  /* =============================
     게시글 실시간 출력
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
          ? post.createdAt.toDate().toLocaleDateString()
          : "";

        item.innerHTML = `
          <h4>${post.title}</h4>
          <p class="meta">${post.writer} · ${date}</p>
          <p class="preview">${post.content}</p>
        `;

        boardList.appendChild(item);
      });
    });
});
