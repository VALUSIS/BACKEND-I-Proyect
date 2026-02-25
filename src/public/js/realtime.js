const socket = io();


window.deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};


const form = document.getElementById("productForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = new FormData(form);
  const product = Object.fromEntries(data.entries());

  socket.emit("newProduct", product);
  form.reset();
});


socket.on("productsUpdated", products => {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.title} - $${p.price}
      <button onclick="deleteProduct('${p.id}')">Eliminar</button>
    `;
    list.appendChild(li);
  });
});
