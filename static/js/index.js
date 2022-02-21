import { Rectangle } from './trial.js';

function grabData(id) {
    return new Promise((resolve, reject) => {
        var url = `https://fakestoreapi.com/products/${id}`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            resolve(JSON.parse(xhr.response));
        }};
        xhr.open("GET", url);
        xhr.send();
    });
}

window.addEventListener('load', () => {
    const proms = [];
    [1,2,3].forEach(id => {
        proms.push(grabData(id));
    });
    Promise.all(proms).then((datas) => {
        for(var i = 0; i<datas.length; i++){
            document.getElementById('title'+(i+1)).innerHTML = datas[i].title;
            document.getElementById('price'+(i+1)).innerHTML = datas[i].price;
            var img = document.querySelector('#image'+(i+1)); img.src=datas[i].image;
        }
    });
    const rec = new Rectangle(10,10);
    console.log(rec.calcArea());
    
})

window.addEventListener('click', (el) => {
    if(el.target.id.startsWith('add')){
        const pr_id = el.target.id.split('-')[1];
        addToCart(pr_id);
    }
})
function addToCart(pr_id){
    var pr_name = document.getElementById('title'+pr_id).innerHTML;
    var pr_cost = document.getElementById('price'+pr_id).innerHTML;
    const no_item = document.querySelector('.no_item');
    if (no_item) {
        no_item.outerHTML = "";
    }
    const table = document.querySelector(".cart_table");
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${pr_name}</td>
        <td>${pr_cost}</td>
    `
    table.appendChild(tr);
}

