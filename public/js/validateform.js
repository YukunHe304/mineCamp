(() => {
  'use strict'

  bsCustomFileInput.init()

  // 选中所有需要验证的表单
  const forms = document.querySelectorAll('.validated-form')

  // 遍历表单并绑定 submit 事件
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        // 如果表单无效，阻止提交
        event.preventDefault()
        event.stopPropagation()
      }

      // 添加 Bootstrap 的验证样式
      form.classList.add('was-validated')
    }, false)
  })
})()
