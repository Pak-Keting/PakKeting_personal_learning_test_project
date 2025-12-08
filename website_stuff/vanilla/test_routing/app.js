let boxes = Array.from(document.getElementsByClassName("box"));

const currentHash = () => location.hash.slice(2);

window.onload = (e => {
  console.log(currentHash());
  selectBox(currentHash());
});

function selectBox(id) {
  boxes.forEach(i => {
    i.classList.toggle("selected", i.id === id);
  });
}

boxes.forEach(i => {
  console.log(i);
  let id = i.id;
  i.addEventListener("click", e => {
    // history.pushState({id}, null, id); // This change the url path, like most SPA does
    location.hash = '/' + id;
    selectBox(id);
  });
});

window.addEventListener("popstate", e => {
  if(e.state !== null) {
    selectBox(e.state.id);
  } else {
    selectBox(null);
  }
});

window.addEventListener("hashchange", () => {
  selectBox(currentHash());
});