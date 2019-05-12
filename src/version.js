export const VERSION = '0.0.1';


export function checkVersion(version) {
  if (version !== VERSION) {
    alert('Current version is different: ' + VERSION);
    return false;
  }
  return true;
}
