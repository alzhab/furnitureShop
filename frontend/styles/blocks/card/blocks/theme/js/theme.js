export default function startTheme() {
  const themeList = document.querySelector('.theme__list')

  themeList.addEventListener('click', changeTheme)

  function changeTheme(e) {
    console.log(e.target.tagName)
    if (e.target.tagName != 'IMG') return

    Array.from(themeList.children).forEach(item => {
      item.classList.remove('active')
    })

    e.target.parentNode.classList.add('active')

  }
}