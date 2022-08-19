import getFilepath from "./getFilepath.js";

export default function useRelativePath(relativePath: string) {
  const filePath = getFilepath(2);
  const filePaths = filePath.split("//")[1].split("/").slice(1);
  const relativePaths = relativePath.split("/");

  for (let i = 0; i < relativePaths.length; i++) {
    const path = relativePaths[i];
    if (path === "") continue;
    
    if (path === ".") {
      if (i === 0) {
        filePaths.pop();
      }
    } else if (path === "..") {
      if (filePaths.length === 0) throw new Error("Wrong relative path");
      if (i === 0) {
        filePaths.pop();
      }
      filePaths.pop();
    } else {
      filePaths.push(path);
    }
  }

  const absolutePath = window.location.origin + "/" + filePaths.join("/");
  return absolutePath;
}
