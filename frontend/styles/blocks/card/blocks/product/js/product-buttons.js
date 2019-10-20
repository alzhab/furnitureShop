export default function startProductButtons() {
  const productButtonsBig = document.querySelector('.product__button--big')
  const productImg = document.querySelector('.product__img')
  const productRotateCount = document.querySelector('.product__button--big p')

  productButtonsBig.addEventListener('click', rotateImg)

  let rotateCount = 0

  function rotateImg(event) {
    if (event.target.tagName !== 'I') return

    const rotateData = event.target.dataset.target
    if (rotateData == 'rotate-left') {
      rotateCount += 15
    } else {
      rotateCount -= 15
    }
    if (rotateCount >= 360 || rotateCount <= -360) {
      productRotateCount.textContent = 0
      rotateCount = 0
    } else {
      productRotateCount.textContent = rotateCount
    }
    productImg.style.transform = `rotate(${rotateCount}deg)`
  }

}