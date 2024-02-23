fetch('/admin/contagemDocs').then((response) => response.json().then((docs => {
    document.getElementById('barraDeNav').innerHTML = docs
})))