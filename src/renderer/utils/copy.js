export const copy = (val, $message) => {
  let input = document.createElement('input')
  input.value = val
  input.style.height = 0
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  $message.success('复制成功！')
  document.body.removeChild(input)
}
