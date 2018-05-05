var sidebar = document.querySelector('#w3-sidebar');
var blockquote = document.querySelectorAll('blockquote');

//shadow effect on hover
sidebar.addEventListener('pointerenter',function(){
    this.classList.add('shadow-lg');
    this.classList.add('trans');
});

sidebar.addEventListener('pointerleave',function(){
    this.classList.remove('shadow-lg');
});

for(var i = 0;i<blockquote.length;i++){
    blockquote[i].addEventListener('pointerenter',function(){
        this.classList.add('shadow-lg');
        this.classList.add('trans');
        this.classList.add('elevate');
    });
    blockquote[i].addEventListener('pointerleave',function(){
        this.classList.remove('shadow-lg');
        this.classList.remove('elevate');
    });
}