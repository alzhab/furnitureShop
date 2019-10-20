export default function startInfoBody() {
  const infoDetails = document.querySelectorAll('.info__detail')
  const detailList = document.querySelector('.info__body ul')
  const infoText = document.querySelector('.info__text')

  detailList.addEventListener('click', changeDetail)

  function changeDetail(e) {
    if (e.target.tagName != 'LI' || e.target.classList.contains('active')) return

    Array.from(e.currentTarget.children).forEach(item => {
      item.classList.toggle('active')
    })

    const activeLi = document.querySelector('.info__body li.active')
    if (activeLi.textContent == 'Details') {
      infoText.classList.add('info__text--details')

      infoDetails.forEach(item => {
        item.classList.add('info__detail--anim')
      })
    } else {
      infoText.classList.remove('info__text--details')
      infoDetails.forEach(item => {
        item.classList.remove('info__detail--anim')
      })
    }
  }

}