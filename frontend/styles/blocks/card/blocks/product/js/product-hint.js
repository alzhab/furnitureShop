export default function startProductHint() {
  const productImg = document.querySelector('.product__img')
  const productRotateCount = document.querySelector('.product__button--big p')

  productImg.addEventListener('click', toggleHint)
  productImg.addEventListener('dblclick', () => false)

  function toggleHint(event) {
    const isProductHint = /product__hint/.test(event.target.parentNode.className) || /product__hint/.test(event.target.className)
    if (!isProductHint) {
      return
    }

    const hint = /product__hint/.test(event.target.parentNode.className) ? event.target.parentNode : event.target

    setTimeout(() => {
      let rotateCount = productRotateCount.textContent
      hint.style.transform = `rotate(-${rotateCount}deg)`
      hint.classList.toggle('product__hint--close')
    }, 200)

  }

}