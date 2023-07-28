
document.addEventListener("DOMContentLoaded", () => initialize())

function initialize() {
    const form = document.querySelector('#github-form')
    form.addEventListener('submit', (event) => getUsers(event))
    const repoButton = document.querySelector('#repoSearch')
    repoButton.addEventListener('click', () => swapSearch())

}

function swapSearch() {
    console.log("swapSearch called")
    const form = document.querySelector('#github-form')
    const subButton = document.querySelector('#subButton')
    // form.removeEventListener('submit', (event) => getUsers(event))
    let butVal = subButton.value
    if (butVal === "Search for User") {
        
        subButton.value = "Search for Repo"
        // form.addEventListener('submit', (event) => searchRepos(event))
    } else {
        
        subButton.value = "Search for User"
        // form.addEventListener('submit', (event) => getUsers(event))
    }
}

function searchRepos(event) {
    console.log("searchRepos called")
    event.preventDefault()
    repo = document.querySelector('#search').value

    fetch(`https://api.github.com/search/repositories?q=${repo}`, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.github.v3+jso'
        }
    })
    .then(res => res.json())
    .then(data => showRepos(data))
}

function showRepos(data) {
    document.querySelector('#user-list').innerHTML = ''
    data.items.forEach(repo => showRepo(repo))
}

function showRepo(repo) {
    const element = document.createElement('li')
    element.innerText = repo.name
    document.querySelector('#user-list').append(element)

}

function getUsers(event) {
    const subButton = document.querySelector('#subButton')
    
    let butVal = subButton.value
    if (butVal === "Search for User") {
        console.log("getUsers called")
        event.preventDefault()

        user = document.querySelector('#search').value
        

        fetch(`https://api.github.com/search/users?q=${user}`, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.github.v3+jso'
            }
        })
        .then(res => res.json())
        .then(data => renderUsers(data))
    } else {
        searchRepos(event)
    }

}

function renderUsers(data) {
    document.querySelector('#user-list').innerHTML = ''
    data.items.forEach(user => renderUser(user))
}

function renderUser(user) {
    const element = document.createElement('li')

    const userName = document.createElement('h3')
    userName.innerText = `${user.login} (click for repos)`
    userName.addEventListener('click', () => loadRepos(user.login))
    element.append(userName)

    const profileLink = document.createElement('a')
    profileLink.href = user.html_url
    profileLink.textContent = `Profile for ${user.login}`
    element.append(profileLink) 

    const par = document.createElement('p')

    const userImage = document.createElement('img')
    userImage.src = user.avatar_url
    userImage.width = "80"
    par.append(userImage)
    element.append(par)

    

    document.querySelector('#user-list').append(element)

    
}

function loadRepos(login) {

    fetch(`https://api.github.com/users/${login}/repos`)
    .then(res => res.json())
    .then(data => renderRepos(data))
}

function renderRepos(data) {
    document.querySelector('#repos-list').innerHTML = ''
    data.forEach(repo => {renderRepo(repo)})
}

function renderRepo(repo) {
    const element = document.createElement('li')
    element.innerText = repo.name
    document.querySelector('#repos-list').append(element)
}

