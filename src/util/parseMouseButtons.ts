export default function parseMouseButtons(e: MouseEvent, type: "button" | "buttons") {
  let leftClick = false, rightClick = false, wheelClick = false;
  if (type === "buttons") {
    const buttons = e.buttons ?? 0;
    const binary = buttons.toString(2).padStart(5, "0").split("").reverse();

    leftClick = binary[0] === "1";
    rightClick = binary[1] === "1";
    wheelClick = binary[2] === "1";
  } else if (type === "button") {
    const button = e.button;

    leftClick = button === 0;
    rightClick = button === 2;
    wheelClick = button === 1;
  }

  return { leftClick, rightClick, wheelClick };
}
