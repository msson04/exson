document.addEventListener("DOMContentLoaded", () => {
  const writer = document.getElementById("writer");
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const submit = document.getElementById("submit");
  const boardList = document.getElementById("boardList");

  const STORAGE_KEY = "freeBoardPosts";

  let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function render() {
    boardList.innerHTML = "";

    posts.slice().reverse().forEach(post => {
      const item = document.createElement("article");
      item.className = "board-item";

      item.innerHTML = `
        <h4>${post.title}</h4>
        <p class="meta">${post.writer} · ${post.date}</p>
        <p class="preview">${post.content}</p>
      `;

      boardList.appendChild(item);
    });
  }

  submit.addEventListener("click", () => {
    if (!writer.value || !title.value || !content.value) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    posts.push({
      writer: writer.value,
      title: title.value,
      content: content.value,
      date: new Date().toLocaleDateString()
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));

    writer.value = "";
    title.value = "";
    content.value = "";

    render();
  });

  render();
});
