var key=-1;

function downHandler(event) {
  key = event.keyCode;
  event.preventDefault();
};

function upHandler(event) {
  key=-1;
  event.preventDefault();
};

window.addEventListener("keydown", downHandler, false);
window.addEventListener("keyup", upHandler, false);

exports.key = () => {
  return key;
}
